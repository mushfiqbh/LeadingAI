import React from "react";

interface EmptyChatProps {
  userName?: string;
}

export const EmptyChat: React.FC<EmptyChatProps> = ({ userName }) => (
  <div className="flex items-center justify-center h-full p-6 bg-gradient-to-br from-blue-50/30 via-white/10 to-purple-50/30">
    <div className="text-center max-w-2xl">
      {/* Welcome Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          Hello, {userName || "Student"}! 👋
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          I&apos;m your AI assistant for Leading University. How can I help you
          today?
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">Ask me anything</h3>
          </div>
          <p className="text-gray-600 text-xs">
            Get help with questions, explanations, and creative writing
          </p>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">Academic Support</h3>
          </div>
          <p className="text-gray-600 text-xs">
            Find class info, exam schedules, and academic resources
          </p>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">Study Materials</h3>
          </div>
          <p className="text-gray-600 text-xs">
            Search for notes, documents, and study resources
          </p>
        </div>

        <div className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">Image Analysis</h3>
          </div>
          <p className="text-gray-600 text-xs">
            Upload images for detailed explanations and analysis
          </p>
        </div>
      </div>
    </div>
  </div>
);
