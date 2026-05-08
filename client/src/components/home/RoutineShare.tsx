"use client";

import { useState } from "react";
import {Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createRoutineFS } from "@/lib/firestore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RoutineShare() {
  const { user } = useAuth();
  const [sheetUrl, setSheetUrl] = useState("");
  const [category, setCategory] = useState<
    "class-routine" | "exam-routine" | "unset"
  >("unset");
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isFormValid = () => {
    return (
      user &&
      sheetUrl &&
      category &&
      category !== "unset" &&
      sheetUrl.trim().includes("docs.google.com/spreadsheets")
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setErrorMessage(
        "Please fill all required fields and ensure you are logged in.",
      );
      return;
    }
    setUploadStatus("loading");
    setErrorMessage("");

    const routineId = await createRoutineFS({
      sheetUrl: sheetUrl,
      category,
      contributor: {
        uid: user?.uid || "Anonymous",
        name: user?.displayName || "Anonymous",
      },
    });

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5000"
        }/upload/routine`,
        {
          method: "POST",
          body: JSON.stringify({ routineId, sheetUrl, category }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to upload routine");
      }

      setSheetUrl("");
      setCategory("unset");
      setUploadStatus("success");
      setErrorMessage("");
    } catch {
      setUploadStatus("error");
      setErrorMessage(
        "Error uploading routine. Check correct Category and URL.",
      );
    }
  };

  return (
    <div className="w-full mx-auto max-w-md space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-2 block">
            Google Sheet URL <span className="text-red-500">*</span>
          </label>
          <Input
            type="url"
            placeholder="https://docs.google.com/spreadsheets/d/..."
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            disabled={uploadStatus === "loading"}
            className="h-10 text-sm"
          />
          <label>
            Category <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCategory("class-routine")}
              className={`py-2 px-3 rounded-lg border transition-all text-xs font-semibold ${
                category === "class-routine"
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              Class Routine
            </button>
            <button
              type="button"
              onClick={() => setCategory("exam-routine")}
              className={`py-2 px-3 rounded-lg border transition-all text-xs font-semibold ${
                category === "exam-routine"
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              Exam Routine
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-50/80 px-3 py-2 rounded-lg animate-in slide-in-from-top-2">
            <p className="text-red-600 text-xs font-medium">{errorMessage}</p>
          </div>
        )}

        {uploadStatus === "success" && (
          <div className="bg-green-50/80 px-3 py-2 rounded-lg animate-in slide-in-from-top-2">
            <p className="text-green-600 text-xs font-medium">
              Routine shared successfully!
            </p>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!isFormValid() || uploadStatus === "loading"}
          className="w-full h-10 text-sm font-semibold bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 transition-all duration-200"
        >
          {uploadStatus === "loading" ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </div>
          ) : (
            "Post Routine"
          )}
        </Button>
      </div>
    </div>
  );
}
