"use client";

import { useState } from "react";
import Image from "next/image";
import { Bell, Upload, X, ChevronDown } from "lucide-react";
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
  const [expirationCount, setExpirationCount] = useState<number>(1);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const isFormValid = () => {
    return (
      user &&
      noticeImage &&
      expirationOption &&
      noticeImage.type.startsWith("image/") // Ensure it's an image file
    );
  };

  const handleFileUpload = async () => {
    if (!user || !noticeImage || !expirationOption || expirationCount <= 0) {
      setErrorMessage(
        "Please select an image, expiration option, and ensure you are logged in."
      );
      return;
    }

    setUploadStatus("loading");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("image", noticeImage);
    formData.append("userId", user?.uid);
    formData.append("userName", user?.displayName || "Anonymous");
    formData.append(
      "expiryDate",
      calculateExpirationDate(expirationCount, expirationOption)
    );

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
          <p className="text-sm text-gray-600">
            AI uses this to generate responses
          </p>
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

          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => setExpirationCount((c) => Math.max(1, c - 1))}
                disabled={uploadStatus === "loading" || expirationCount <= 1}
                className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold disabled:opacity-50"
              >
                -
              </button>
              <span className="px-3 py-1 rounded bg-white text-gray-900 font-semibold min-w-[2rem] text-center">
                {expirationCount}
              </span>
              <button
                type="button"
                onClick={() => setExpirationCount((c) => c + 1)}
                disabled={uploadStatus === "loading"}
                className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold disabled:opacity-50"
              >
                +
              </button>
            </div>
            <div className="relative">
              <ChevronDown
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  uploadStatus === "loading" ? "text-gray-300" : "text-gray-400"
                }`}
              />
              <select
                value={expirationOption}
                onChange={(e) => setExpirationOption(e.target.value)}
                className={`w-full border-2 border-gray-200/50 rounded-md p-2 text-gray-900 appearance-none ${
                  uploadStatus === "loading"
                    ? "cursor-not-allowed bg-gray-50"
                    : "bg-white"
                }`}
                disabled={uploadStatus === "loading"}
              >
                <option value="" disabled>
                  Select expiration period
                </option>
                {expirationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {expirationOption === "" && (
            <p className="text-xs text-red-500 mt-1">
              Please select an expiration period for the notice
            </p>
          )}

          {expirationOption && (
            <p className="text-xs text-green-600 mt-1">
              Notice will expire on:{" "}
              {
                new Date(
                  calculateExpirationDate(
                    expirationCount,
                    expirationOption
                  ).valueOf()
                )
                  .toString()
                  .split("00")[0]
              }
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
              Processing...
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
        <div className="bg-green-50 border border-green-200 text-green-700 mt-5 px-4 py-3 rounded-xl">
          <p className="text-sm">Notice uploaded successfully! 🎉</p>
        </div>
      )}
    </>
  );
}
