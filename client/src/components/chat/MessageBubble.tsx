"use client";

import React from "react";
import Image from "next/image";
import { Copy, Check, X } from "lucide-react";
import { Message } from "../../types/types";
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
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`overflow-x-auto max-w-4xl ${isUser ? "order-first" : ""}`}>
        <div
          className={`flex flex-col rounded-2xl px-3 py-1 ${
            isUser
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
              : "bg-white/90 backdrop-blur-sm text-gray-900 border border-gray-200/50 shadow-lg"
          }`}
        >
          <div className="mb-2 last:mb-0">
            <div
              className={`prose prose-sm max-w-none ${
                isUser ? "prose-invert" : ""
              }`}
            >
              {isUser ? (
                <div className="whitespace-pre-wrap break-words leading-relaxed">
                  {message.content.text}
                </div>
              ) : (
                <div className="relative">
                  {statusMessage && !message.content.text ? (
                    <TypingIndicator statusMessage={statusMessage} />
                  ) : (
                    // Never style this div as "whitespace-pre-wrap break-words", MarkdownRenderer will handle it
                    <div>
                      <MarkdownRenderer content={message.content.text} />
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
                <div className="mt-4 h-[120px] w-[180px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
                  {message.content.uploadStatus === "pending" && (
                    <div className="text-center text-gray-600">
                      <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                      <div className="text-sm font-medium">
                        Uploading image...
                      </div>
                    </div>
                  )}
                  {message.content.uploadStatus === "sent" && (
                    <div className="text-center text-blue-600">
                      <div className="animate-pulse w-8 h-8 border-3 border-blue-500 rounded-full mx-auto mb-3"></div>
                      <div className="text-sm font-medium">
                        Processing image...
                      </div>
                    </div>
                  )}
                  {message.content.uploadStatus === "done" && (
                    <div className="text-center text-green-600">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Check className="w-5 h-5" />
                      </div>
                      <div className="text-sm font-medium">Image Uploaded</div>
                    </div>
                  )}
                  {message.content.uploadStatus === "error" && (
                    <div className="text-center text-red-600">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <X className="w-5 h-5" />
                      </div>
                      <div className="text-sm font-medium">
                        Upload failed. Please try again.
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* Actual image - show when upload is complete or for assistant messages */}
            {message.content.imageUrl && (
              <div className="mt-4 h-[120px] w-[180px] border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-sm">
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
              className="cursor-pointer transition-all p-1.5 hover:bg-gray-200 rounded-lg opacity-60 hover:opacity-100"
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
    </div>
  );
};
