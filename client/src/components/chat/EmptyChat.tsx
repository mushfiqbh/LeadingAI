import React from "react";

interface EmptyChatProps {
  userName?: string;
}

export const EmptyChat: React.FC<EmptyChatProps> = ({ userName }) => (
  <div className="flex items-center justify-center p-6 bg-gradient-to-br from-blue-50/30 via-white/10 to-purple-50/30">
    <div className="text-center max-w-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          Hello, {userName || "Student"}! 👋
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          I&apos;m your AI assistant for Leading University. How can I help you
          today?
        </p>
      </div>
    </div>
  </div>
);
