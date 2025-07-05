"use client";

import React from "react";
import Image from "next/image";
import { User, Bot, Copy, Check, X } from "lucide-react";
import { Message } from "../../types";
import MarkdownRenderer from "./MarkdownRenderer";
import { TypingIndicator } from "./TypingIndicator";
import { formatTime } from "@/utils/formatFirebaseTimestamp";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  statusMessage?: string; // NEW: Accept status message
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isStreaming = false,
  statusMessage = "", // NEW: Default to empty string
}) => {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === "user";

  // ... (handleCopy and formatTime functions are the same)
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  if (
    !message.content.text &&
    !statusMessage &&
    !message.content.uploadStatus &&
    !message.content.imageUrl
  )
    return null;

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <div className={`max-w-4xl ${isUser ? "order-first" : ""}`}>
        <div
          className={`flex flex-col rounded-2xl px-4 py-2 ${
            isUser
              ? "bg-blue-600 text-white ml-auto"
              : "bg-white text-gray-900 border border-gray-200 shadow-sm"
          }`}
        >
          <div className="mb-2 last:mb-0">
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
                  {statusMessage && !message.content.text ? (
                    <TypingIndicator statusMessage={statusMessage} />
                  ) : (
                    // Never style this div as "whitespace-pre-wrap break-words", MarkdownRenderer will handle it
                    <div>
                      <MarkdownRenderer content={message.content.text || ""} />
                      {isStreaming && message.content.text && (
                        <span className="inline-block w-2 h-5 bg-blue-500 ml-1 animate-pulse" />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Upload status and placeholder */}
            {message.content.uploadStatus &&
              message.content.uploadStatus !== "none" &&
              !message.content.imageUrl && (
                <div className="mt-3 h-[100px] w-[150px] flex items-center justify-center border border-gray-300 rounded-lg bg-gray-50">
                  {message.content.uploadStatus === "pending" && (
                    <div className="text-center text-gray-600">
                      <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <div className="text-sm">Uploading image...</div>
                    </div>
                  )}
                  {message.content.uploadStatus === "sent" && (
                    <div className="text-center text-blue-600">
                      <div className="animate-pulse w-8 h-8 border-2 border-blue-500 rounded-full mx-auto mb-2"></div>
                      <div className="text-sm">Processing image...</div>
                    </div>
                  )}
                  {message.content.uploadStatus === "received" && (
                    <div className="text-center text-green-600">
                      <Check className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-sm">Image Uploaded</div>
                    </div>
                  )}
                  {message.content.uploadStatus === "done" && (
                    <div className="text-center text-green-600">
                      <Check className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-sm">Image Uploaded</div>
                    </div>
                  )}
                  {message.content.uploadStatus === "error" && (
                    <div className="text-center text-red-600">
                      <X className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-sm">
                        Upload failed. Please try again.
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* Actual image - show when upload is complete or for assistant messages */}
            {message.content.imageUrl && (
              <div className="mt-3 h-[100px] w-[150px] border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <Image
                  width={300}
                  height={200}
                  src={message.content.imageUrl}
                  alt="Shared image"
                  className="w-full h-full object-contain"
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
              className="cursor-pointer transition-opacity p-1 hover:bg-gray-200 rounded"
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
