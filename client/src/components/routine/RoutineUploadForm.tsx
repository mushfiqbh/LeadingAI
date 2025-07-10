"use client";

import { useState } from "react";
import { Calendar, Link } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  calculateExpirationDate,
  expirationOptions,
} from "@/utils/noticeUtils";

interface RoutineUploadFormProps {
  onUploadSuccess?: () => void;
}

export default function RoutineUploadForm({
  onUploadSuccess,
}: RoutineUploadFormProps) {
  const { user } = useAuth();
  const [routineUrl, setRoutineUrl] = useState("");
  const [title, setTitle] = useState("");
  const [expirationOption, setExpirationOption] = useState<string>("");
  const [category, setCategory] = useState<"class-routine" | "exam-routine">(
    "class-routine"
  );
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isFormValid = () => {
    return user && routineUrl && title && category && expirationOption !== "";
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setErrorMessage(
        "Please fill all required fields and ensure you are logged in."
      );
      return;
    }
    setUploadStatus("loading");
    setErrorMessage("");
    const formData = new FormData();
    formData.append("url", routineUrl);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("status", "pending");
    formData.append("userId", user?.uid || "");
    formData.append("userName", user?.displayName || "Anonymous");
    formData.append("expiryDate", calculateExpirationDate(expirationOption));
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5000"
        }/upload/routine`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to upload routine");
      }
      setRoutineUrl("");
      setTitle("");
      setCategory("class-routine");
      setUploadStatus("success");
      setExpirationOption("");
      setErrorMessage("");
      if (onUploadSuccess) onUploadSuccess();
    } catch {
      setUploadStatus("error");
      setErrorMessage("Error uploading routine");
    }
  };

  return (
    <div className="w-full md:w-1/2 mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Upload Routine
          </h3>
          <p className="text-sm text-gray-600">
            Share your class or exam routine via Google Sheets
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Routine Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., CSE 2025 Class Routine"
          className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200"
        />
        <label className="block text-sm font-medium text-gray-700">
          Routine Category
        </label>
        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as "class-routine" | "exam-routine")
          }
          className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200"
        >
          <option value="class-routine">Class Routine</option>
          <option value="exam-routine">Exam Routine</option>
        </select>
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
        <label className="block text-sm font-medium text-gray-700">
          Google Sheets URL
        </label>
        <div className="relative">
          <input
            type="url"
            value={routineUrl}
            onChange={(e) => setRoutineUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200"
          />
          <Link className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
        </div>

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <button
          onClick={handleSubmit}
          disabled={uploadStatus === "loading"}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-60"
        >
          {uploadStatus === "loading" ? "Uploading..." : "Submit Routine"}
        </button>
      </div>
    </div>
  );
}
