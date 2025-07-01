import React from "react";

interface TypingIndicatorProps {
  statusMessage: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  statusMessage,
}) => {
  return (
    <div className="flex items-center gap-3 bg-white text-blue-600">
      {/* Status Message */}
      <span className="font-medium whitespace-nowrap">
        {statusMessage}
      </span>

      {/* Animated Dots */}
      <div className="flex gap-1">
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
};
