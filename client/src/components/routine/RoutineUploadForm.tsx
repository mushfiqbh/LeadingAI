"use client";

import { useState } from "react";
import { Calendar, ChevronDown, Link } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  calculateExpirationDate,
  expirationOptions,
} from "@/utils/noticeUtils";
import { createRoutineFS } from "@/lib/routine";

interface RoutineUploadFormProps {
  onUploadSuccess?: () => void;
}

export default function RoutineUploadForm({
  onUploadSuccess,
}: RoutineUploadFormProps) {
  const { user } = useAuth();
  const [routineUrl, setRoutineUrl] = useState("");
  const [expirationOption, setExpirationOption] = useState<string>("");
  const [category, setCategory] = useState<"class-routine" | "exam-routine">(
    "class-routine"
  );
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isFormValid = () => {
    return (
      user &&
      routineUrl &&
      category &&
      expirationOption !== "" &&
      routineUrl.trim().includes("docs.google.com/spreadsheets")
    );
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

    const routineId = await createRoutineFS({
      url: routineUrl,
      category,
      contributor: {
        uid: user?.uid || "Anonymous",
        name: user?.displayName || "Anonymous",
      },
      expiryDate: calculateExpirationDate(expirationOption),
    });

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5000"
        }/upload/routine`,
        {
          method: "POST",
          body: JSON.stringify({ routineId, routineUrl, category }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload routine");
      }

      setRoutineUrl("");
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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6">
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
          Select Category
        </label>
        <div className="flex gap-4 mb-4">
          {[
            {
              value: "class-routine",
              label: "Class Routine",
              color: "bg-slate-400",
            },
            {
              value: "exam-routine",
              label: "Exam Routine",
              color: "bg-slate-400",
            },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                setCategory(opt.value as "class-routine" | "exam-routine")
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow-sm transition-all duration-200 text-sm
                ${
                  category === opt.value
                    ? `${opt.color} text-white border-blue-500 scale-105`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              aria-pressed={category === opt.value}
            >
              {category === opt.value && (
                <span className="inline-block w-2 h-2 rounded-full bg-white mr-2"></span>
              )}
              {opt.label}
            </button>
          ))}
        </div>

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
              Please select an expiration period for the routine
            </p>
          )}

          {expirationOption && (
            <p className="text-xs text-green-600 mt-1">
              Routine will expire on:{" "}
              {new Date(
                calculateExpirationDate(expirationOption)
              ).toLocaleDateString()}
            </p>
          )}
        </div>

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <button
          onClick={handleSubmit}
          disabled={uploadStatus === "loading" || !isFormValid()}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-60"
        >
          {uploadStatus === "loading" ? "Uploading..." : "Submit Routine"}
        </button>
      </div>
    </div>
  );
}
