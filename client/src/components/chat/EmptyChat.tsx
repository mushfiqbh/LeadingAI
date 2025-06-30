import React from "react";

interface EmptyChatProps {
  userName?: string;
}

export const EmptyChat: React.FC<EmptyChatProps> = ({ userName }) => (
  <div className="flex items-center justify-center h-full p-4">
    <div className="text-center max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Hello! {userName || "Anonymous"} 👋
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-50 rounded-lg p-3 text-left">
          <p className="font-medium text-gray-900">💬 Ask me anything</p>
          <p className="text-gray-600">Questions, explanations, creative writing</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-left">
          <p className="font-medium text-gray-900">📚 Find and explore</p>
          <p className="text-gray-600">Get class, exam, and academic information</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-left">
          <p className="font-medium text-gray-900">🔍 Download Documents</p>
          <p className="text-gray-600">Search for notes and files</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-left">
          <p className="font-medium text-gray-900">🖼️ Analyze images</p>
          <p className="text-gray-600">Upload an image for explanation</p>
        </div>
      </div>
    </div>
  </div>
);