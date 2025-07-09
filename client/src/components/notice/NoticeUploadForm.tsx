"use client";

import { useState } from "react";
import Image from "next/image";
import { Bell, Upload, X, Calendar, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  expirationOptions,
  calculateExpirationDate,
} from "@/utils/noticeUtils";

interface NoticeUploadFormProps {
  onUploadSuccess?: () => void;
}

export default function NoticeUploadForm({
  onUploadSuccess,
}: NoticeUploadFormProps) {
  const { user } = useAuth();
  const [noticeImage, setNoticeImage] = useState<File | null>(null);
  const [expirationOption, setExpirationOption] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const isFormValid = () => {
    return user && noticeImage && expirationOption !== "";
  };

  const handleFileUpload = async () => {
    if (!user || !noticeImage || !expirationOption) {
      setErrorMessage(
        "Please select an image, expiration option, and ensure you are logged in."
      );
      return;
    }

    setUploadStatus("loading");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("image", noticeImage);
    formData.append("category", "general");
    formData.append("userId", user?.uid);
    formData.append("userName", user?.displayName || "Anonymous");
    formData.append("expiryDate", calculateExpirationDate(expirationOption));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/upload/notice`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload notice image");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Upload failed");
      }

      setUploadStatus("success");
      setNoticeImage(null);
      setExpirationOption("");

      // Call the callback to refresh parent component if provided
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      setTimeout(() => setUploadStatus("idle"), 5000);
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again."
      );
      console.error("Error uploading notice:", error);
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Upload University Notice
          </h3>
          <p className="text-sm text-gray-600">Upload important notices</p>
        </div>
      </div>

      <div className="space-y-4">
        <div
          className={`transition-opacity duration-200 ${
            uploadStatus === "loading" ? "opacity-50" : "opacity-100"
          }`}
        >
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNoticeImage(e.target.files?.[0] || null)}
              className="hidden"
              disabled={uploadStatus === "loading"}
            />
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${
                uploadStatus === "loading"
                  ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                  : "border-gray-300 hover:border-orange-400 hover:bg-orange-50/50"
              }`}
            >
              {noticeImage ? (
                <div className="relative">
                  <Image
                    src={URL.createObjectURL(noticeImage)}
                    alt="Notice preview"
                    width={200}
                    height={128}
                    className="max-w-full h-32 object-contain mx-auto rounded-lg"
                  />
                  <button
                    onClick={() => setNoticeImage(null)}
                    disabled={uploadStatus === "loading"}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload
                    className={`w-8 h-8 mx-auto mb-2 ${
                      uploadStatus === "loading"
                        ? "text-gray-300"
                        : "text-gray-400"
                    }`}
                  />
                  <p
                    className={
                      uploadStatus === "loading"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }
                  >
                    {uploadStatus === "loading"
                      ? "Uploading..."
                      : "Click to upload notice image"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </>
              )}
            </div>
          </label>
        </div>

        <div
          className={`transition-opacity duration-200 ${
            uploadStatus === "loading" ? "opacity-50" : "opacity-100"
          }`}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notice Expiration Period <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <Calendar
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                uploadStatus === "loading" ? "text-gray-300" : "text-gray-400"
              }`}
            />
            <ChevronDown
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                uploadStatus === "loading" ? "text-gray-300" : "text-gray-400"
              }`}
            />
            <select
              value={expirationOption}
              onChange={(e) => setExpirationOption(e.target.value)}
              disabled={uploadStatus === "loading"}
              className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed ${
                expirationOption === ""
                  ? "border-red-300 text-gray-500"
                  : "border-gray-300 text-gray-900"
              }`}
            >
              {expirationOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-gray-900"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {expirationOption === "" && (
            <p className="text-xs text-red-500 mt-1">
              Please select an expiration period for the notice
            </p>
          )}

          {expirationOption && (
            <p className="text-xs text-green-600 mt-1">
              Notice will expire on:{" "}
              {new Date(
                calculateExpirationDate(expirationOption)
              ).toLocaleDateString()}
            </p>
          )}
        </div>

        <button
          onClick={handleFileUpload}
          disabled={!isFormValid() || uploadStatus === "loading"}
          className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
        >
          {uploadStatus === "loading" ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Uploading Notice...
            </div>
          ) : (
            "Submit Notice"
          )}
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Success Message */}
      {uploadStatus === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
          <p className="text-sm">Notice uploaded successfully! 🎉</p>
        </div>
      )}
    </>
  );
}
