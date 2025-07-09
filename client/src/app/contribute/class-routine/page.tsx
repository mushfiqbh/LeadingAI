"use client";

import { useState } from "react";
import { Calendar, Link } from "lucide-react";

const API_ENDPOINT =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5000";

export default function ClassRoutineForm() {
  const [classRoutineUrl, setClassRoutineUrl] = useState("");

  const handleSubmit = async () => {
    if (!classRoutineUrl) {
      alert("Please enter a valid Google Sheets URL.");
      return;
    }
    const formData = new FormData();
    formData.append("url", classRoutineUrl);
    formData.append(
      "expiryDate",
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    );

    try {
      const response = await fetch(`${API_ENDPOINT}/upload/class-routine`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload class routine");
      }

      const data = await response.json();
      console.log("Class routine uploaded successfully:", data);
      setClassRoutineUrl(""); // Clear the input after successful upload
    } catch (error) {
      console.error("Error uploading class routine:", error);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Class Routine</h3>
          <p className="text-sm text-gray-600">
            Share your class schedule via Google Sheets
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
            value={classRoutineUrl}
            onChange={(e) => setClassRoutineUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200"
          />
          <Link className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          Submit Class Routine
        </button>
      </div>
    </div>
  );
}
