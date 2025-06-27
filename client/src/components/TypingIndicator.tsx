import React from "react";
import { Bot } from "lucide-react";

interface TypingIndicatorProps {
  statusMessage: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  statusMessage,
}) => {
  return (
    <div className="flex justify-start items-start animate-fade-in">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="max-w-3xl w-full flex justify-start px-4 py-3">
        <div className="flex items-center gap-3 bg-white border border-blue-200 rounded-xl px-4 py-2 shadow-md text-blue-700 animate-fade-in">
          {/* Status Message */}
          <span className="font-medium whitespace-nowrap">
            {statusMessage.length ? statusMessage : "Please wait"}
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
      </div>
    </div>
  );
};
