"use client";

import React from "react";
import Image from "next/image";
import { User, Bot, Copy, Check } from "lucide-react";
import { ChatMessage } from "../types";
import MarkdownRenderer from "./MarkdownRenderer";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isStreaming = false,
}) => {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === "user";

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={`flex gap-4 p-4 ${
        isUser ? "justify-end" : "justify-start"
      } group animate-fade-in`}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <div className={`max-w-4xl ${isUser ? "order-first" : ""}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-blue-600 text-white ml-auto"
              : "bg-white text-gray-900 border border-gray-200 shadow-sm"
          }`}
        >
          <div className="mb-2 last:mb-0">
            {message.content.text && (
              <div
                className={`prose prose-sm max-w-none ${
                  isUser ? "prose-invert" : ""
                }`}
              >
                {isUser ? (
                  <div className="whitespace-pre-wrap break-words">
                    {message.content.text}
                  </div>
                ) : (
                  <div className="relative">
                    <MarkdownRenderer content={message.content.text} />
                    {isStreaming && (
                      <span className="inline-block w-2 h-5 bg-blue-500 ml-1 animate-pulse" />
                    )}
                  </div>
                )}
              </div>
            )}
            {message.content.image && (
              <div className="mt-2">
                <Image
                  width={400}
                  height={300}
                  src={URL.createObjectURL(message.content.image)}
                  alt="Shared image"
                  className="rounded-lg max-w-full h-auto shadow-md"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>

        <div
          className={`flex items-center gap-2 mt-2 text-xs text-gray-500 ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          <span>{formatTime(message.timestamp)}</span>
          {!isUser && !isStreaming && message.content.text && (
            <button
              onClick={() => {
                const textContent = message.content.text;
                handleCopy(textContent);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};
