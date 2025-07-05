"use client";

import ProtectedRoute from "@/components/general/ProtectedRoute";
import { useState } from "react";
import { Upload, Link, Calendar, Bus, Bell, FileText, X } from "lucide-react";
import Image from "next/image";

const ContributePage = () => {
  const [classRoutineUrl, setClassRoutineUrl] = useState("");
  const [examRoutineUrl, setExamRoutineUrl] = useState("");
  const [busScheduleImage, setBusScheduleImage] = useState<File | null>(null);
  const [noticeImage, setNoticeImage] = useState<File | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileUpload = (
    files: FileList | null,
    type: "bus" | "notice" | "notes"
  ) => {
    if (!files) return;

    if (type === "bus") {
      setBusScheduleImage(files[0]);
    } else if (type === "notice") {
      setNoticeImage(files[0]);
    } else if (type === "notes") {
      const newFiles = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeImage = (type: "bus" | "notice") => {
    if (type === "bus") {
      setBusScheduleImage(null);
    } else {
      setNoticeImage(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              This page is under construction
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Help your fellow students by sharing academic resources,
              schedules, and important notices
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Class Routine Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Class Routine
                  </h3>
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
                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                  Submit Class Routine
                </button>
              </div>
            </div>

            {/* Exam Routine Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Exam Routine
                  </h3>
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
                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                  Submit Exam Routine
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Bus Schedule Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Bus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Bus Schedule
                  </h3>
                  <p className="text-sm text-gray-600">
                    Upload bus schedule image
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files, "bus")}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50/50 transition-all duration-200 cursor-pointer">
                    {busScheduleImage ? (
                      <div className="relative">
                        <Image
                          src={URL.createObjectURL(busScheduleImage)}
                          alt="Bus schedule preview"
                          width={200}
                          height={128}
                          className="max-w-full h-32 object-contain mx-auto rounded-lg"
                        />
                        <button
                          onClick={() => removeImage("bus")}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">
                          Click to upload bus schedule image
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </label>
                <button className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                  Submit Bus Schedule
                </button>
              </div>
            </div>

            {/* Notice Upload Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    University Notice
                  </h3>
                  <p className="text-sm text-gray-600">
                    Upload important notices
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files, "notice")}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 hover:bg-orange-50/50 transition-all duration-200 cursor-pointer">
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
                          onClick={() => removeImage("notice")}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">
                          Click to upload notice image
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </label>
                <button className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                  Submit Notice
                </button>
              </div>
            </div>
          </div>

          {/* PDF Notes Upload Card - Full Width */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Study Notes & Materials
                </h3>
                <p className="text-sm text-gray-600">
                  Upload PDF notes, books, and study materials
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="e.g., CSE 101 - Programming Fundamentals Notes"
                    className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={noteDescription}
                    onChange={(e) => setNoteDescription(e.target.value)}
                    placeholder="Describe the contents, which course it's for, semester, etc."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all duration-200 resize-none"
                  />
                </div>
              </div>

              {/* File Upload Section */}
              <div className="space-y-4">
                <label className="block">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files, "notes")}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200 cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click to upload files</p>
                    <p className="text-xs text-gray-400 mt-1">
                      PDF, DOC, PPT up to 50MB each
                    </p>
                  </div>
                </label>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm text-gray-700 truncate">
                            {file.name}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                Submit Study Materials
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ContributePage;
