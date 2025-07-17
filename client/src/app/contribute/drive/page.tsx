"use client";

import { useState } from "react";
import {
  FolderOpen,
  ExternalLink,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function DriveForm() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Your shared Google Drive folder URL
  const SHARED_DRIVE_URL =
    "https://drive.google.com/drive/folders/1KFpim2vo9_Z3ZItZw62vrZONLlXb4mBg";

  const handleRedirectToDrive = () => {
    setIsRedirecting(true);
    // Open Google Drive in a new tab
    window.open(SHARED_DRIVE_URL, "_blank");
    // Reset the redirecting state after a short delay
    setTimeout(() => setIsRedirecting(false), 2000);
  };

  const filenameExamples = [
    {
      bad: "notes.pdf",
      good: "CSE1201_Data_Structures_Lecture_1_4th_Semester.pdf",
    },
    {
      bad: "book.pdf",
      good: "DataStructures_Algorithms_Cormen_3rdEdition_Complete.pdf",
    },
    {
      bad: "assignment.docx",
      good: "CSE3111_OOP_Assignment3_InheritancePolymorphism_5th_Semester.docx",
    },
  ];

  return (
    <div className="w-full md:w-1/2 mx-auto space-y-8 p-6">
      {/* Shared Drive Folder Card */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                Share Study Materials
              </h4>
              <p className="text-sm text-gray-600">
                Notes, Books, Question Papers
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-2">
            Click the button below to access our shared Google Drive folder
            where you can upload your study materials directly.
          </p>
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>Important:</strong> Please use descriptive filenames so
              our AI can properly categorize and index your materials.
            </span>
          </div>
        </div>

        <button
          onClick={handleRedirectToDrive}
          disabled={isRedirecting}
          className="w-full py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isRedirecting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Opening Google Drive...
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4" />
              Open Shared Drive Folder
            </>
          )}
        </button>
      </div>

      {/* Filename Guidelines */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-gray-800">
            File Naming Guidelines
          </h4>
        </div>

        <p className="text-md text-gray-600 mb-4">
          To help our AI model properly recognize and categorize your files,
          please use descriptive filenames that include:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <h5 className="font-medium text-gray-800">Include in filename:</h5>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                Course code (e.g., CSE101, MATH201)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                Subject name or topic
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                Content type (Notes, Assignment, Book)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                Semester/Year (e.g., 2nd Year, 4th Semester)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                Chapter/Section if applicable
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-medium text-gray-800">
              Use underscores (_) instead of spaces
            </h5>
            <div className="text-xs text-gray-500 space-y-1">
              <div>✅ Good: Readable by AI</div>
              <div>❌ Bad: Generic names</div>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-4">
          <h5 className="font-medium text-gray-800">Examples:</h5>
          {filenameExamples.map((example, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-2">
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 font-mono mt-1">❌</span>
                  <code className="text-red-600 bg-red-50 p-1 rounded break-all">
                    {example.bad}
                  </code>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 font-mono mt-1">✅</span>
                  <code className="text-green-600 bg-green-50 p-1 rounded text-xs break-all word-break flex-1">
                    {example.good}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Steps */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          How to Upload:
        </h4>
        <div className="space-y-3">
          {[
            "Click 'Open Shared Drive Folder' button above",
            "Rename your files using the guidelines provided",
            "Drag and drop or upload your files to the folder",
            "Our AI will automatically process and categorize them",
          ].map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-sm text-gray-700 pt-0.5">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
