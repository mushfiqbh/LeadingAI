"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X, ChevronDown, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  expirationOptions,
  calculateExpirationDate,
} from "@/utils/noticeUtils";
import { Button } from "@/components/ui/Button";

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
        "Please select an image, expiration option, and ensure you are logged in.",
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
      calculateExpirationDate(expirationCount, expirationOption),
    );

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/upload/notice`,
        {
          method: "POST",
          body: formData,
        },
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
          : "Upload failed. Please try again.",
      );
      console.error("Error uploading notice:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-orange-50/50 via-amber-50/50 to-yellow-50/50 rounded-2xl p-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl"></div>
        <div className="relative">
          <h3 className="text-lg font-bold text-gray-900">
            Upload University Notice
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            AI uses this to generate responses
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-2 block">
            Upload Notice Image <span className="text-red-500">*</span>
          </label>
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
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer ${
                  uploadStatus === "loading"
                    ? "border-gray-100 bg-gray-50 cursor-not-allowed"
                    : "border-gray-200 bg-gray-50 hover:bg-white hover:border-orange-300 hover:shadow-md"
                }`}
              >
                {noticeImage ? (
                  <div className="relative group">
                    <Image
                      src={URL.createObjectURL(noticeImage)}
                      alt="Notice preview"
                      width={400}
                      height={200}
                      className="max-w-full h-40 object-contain mx-auto rounded-xl"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setNoticeImage(null);
                      }}
                      disabled={uploadStatus === "loading"}
                      className="absolute -top-2 -right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-all shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="p-3 bg-white rounded-xl shadow-sm mb-3">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-semibold text-gray-600">
                      {uploadStatus === "loading"
                        ? "Uploading..."
                        : "Click to upload notice image"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-600 mb-2 block">
            Expiration <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-0.5">
              <button
                type="button"
                onClick={() => setExpirationCount((c) => Math.max(1, c - 1))}
                disabled={uploadStatus === "loading" || expirationCount <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-gray-700 font-bold transition-all disabled:opacity-30"
              >
                -
              </button>
              <span className="w-10 text-center text-gray-900 font-bold text-sm">
                {expirationCount}
              </span>
              <button
                type="button"
                onClick={() => setExpirationCount((c) => c + 1)}
                disabled={uploadStatus === "loading"}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-gray-700 font-bold transition-all disabled:opacity-30"
              >
                +
              </button>
            </div>
            <div className="relative flex-1">
              <select
                value={expirationOption}
                onChange={(e) => setExpirationOption(e.target.value)}
                className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs font-semibold appearance-none focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent transition-all"
                disabled={uploadStatus === "loading"}
              >
                <option value="" disabled>
                  Select unit
                </option>
                {expirationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          {expirationOption && (
            <div className="mt-2 px-2 py-1.5 bg-green-50/60 rounded-lg">
              <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wider">
                Expires:{" "}
                {new Date(
                  calculateExpirationDate(
                    expirationCount,
                    expirationOption,
                  ).valueOf(),
                ).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-in slide-in-from-top-2">
            <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        {uploadStatus === "success" && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-xl animate-in slide-in-from-top-2">
            <p className="text-green-700 text-sm font-semibold flex items-center gap-2">
              <span className="text-xl">✨</span> Notice posted successfully!
            </p>
          </div>
        )}

        <Button
          onClick={handleFileUpload}
          disabled={!isFormValid() || uploadStatus === "loading"}
          className="w-full py-6 text-base font-bold bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300"
        >
          {uploadStatus === "loading" ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              Uploading notice...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Upload className="w-5 h-5" />
              Post Notice
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
