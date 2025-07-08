"use client";

import { useState } from "react";
import { Calendar, Link } from "lucide-react";

export default function ExamRoutineForm() {
  const [examRoutineUrl, setExamRoutineUrl] = useState("");
  const API_ENDPOINT =
    process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5000";

  const handleSubmit = async () => {
    if (!examRoutineUrl) {
      alert("Please enter a valid Google Sheets URL.");
      return;
    }
    const formData = new FormData();
    formData.append("url", examRoutineUrl);

    formData.append(
      "expire_date",
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    );
    try {
      const response = await fetch(`${API_ENDPOINT}/upload/exam-routine`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload exam routine");
      }

      const data = await response.json();
      console.log("Exam routine uploaded successfully:", data);
      setExamRoutineUrl(""); // Clear the input after successful upload
    } catch (error) {
      console.error("Error uploading exam routine:", error);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Exam Routine</h3>
          <p className="text-sm text-gray-600">
            Share exam schedule via Google Sheets
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Google Sheets URL
        </label>
        <div className="relative">
          <input
            type="url"
            value={examRoutineUrl}
            onChange={(e) => setExamRoutineUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-200"
          />
          <Link className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          Submit Exam Routine
        </button>
      </div>
    </div>
  );
}
