"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Copy, Check, X, Plus } from "lucide-react";
import { Message } from "../../types/types";
import MarkdownRenderer from "./MarkdownRenderer";
import { TypingIndicator } from "./TypingIndicator";
import { formatTime } from "@/utils/formatFirebaseTimestamp";
import { useAuth } from "@/context/AuthContext";
import { createNoteFS } from "@/lib/firestore";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  statusMessage?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isStreaming = false,
  statusMessage = "",
}) => {
  const { user } = useAuth();
  const [copied, setCopied] = React.useState(false);
  const [savingNote, setSavingNote] = React.useState(false);
  const [savedNote, setSavedNote] = React.useState(false);
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

  const handleSaveToNote = async () => {
    if (!user || !message.content.text) return;
    setSavingNote(true);
    try {
      await createNoteFS(user.uid, message.content.text);
      setSavedNote(true);
      setTimeout(() => setSavedNote(false), 3000);
    } catch (err) {
      console.error("Failed to save note:", err);
    } finally {
      setSavingNote(false);
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
    <div className={`flex gap-2 sm:gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`overflow-x-auto max-w-full sm:max-w-4xl ${isUser ? "order-first" : ""}`}
      >
        <div
          className={`flex flex-col rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 ${
            isUser
              ? "bg-blue-600/10 text-blue-50 border border-blue-500/20"
              : "bg-white/5 backdrop-blur-sm text-gray-200 border border-white/10"
          }`}
        >
          <div className="mb-1 sm:mb-2 last:mb-0">
            <div
              className={`prose prose-sm max-w-none prose-invert`}
            >
              {isUser ? (
                <div className="whitespace-pre-wrap wrap-break-words leading-relaxed text-sm sm:text-[15px]">
                  {message.content.text}
                </div>
              ) : (
                <div className="relative text-sm sm:text-[15px]">
                  {
                    // FIX: Show TypingIndicator only when a status exists AND there's no text or image yet.
                    statusMessage &&
                    !message.content.text &&
                    !message.content.imageUrl ? (
                      <TypingIndicator statusMessage={statusMessage} />
                    ) : message.content.text ? (
                      // Render text if it exists.
                      <div className="space-y-3 sm:space-y-4">
                        <MarkdownRenderer content={message.content.text} />
                        {isStreaming && (
                          <span className="inline-block w-1.5 h-4 bg-blue-500/80 ml-1 animate-pulse rounded-full align-middle" />
                        )}
                        
                        <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/5">
                          <button 
                            onClick={handleSaveToNote}
                            disabled={savingNote || savedNote}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs transition-all ${
                              savedNote 
                                ? "bg-green-500/20 text-green-400" 
                                : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                            }`}
                          >
                            {savedNote ? (
                              <><Check className="w-3 h-3" /> Saved</>
                            ) : (
                              <><Plus className="w-3 h-3" /> {savingNote ? "Saving..." : "Save to note"}</>
                            )}
                          </button>
                          <div className="flex items-center gap-2 sm:gap-3 text-gray-500">
                            <Check className="w-3.5 h-3.5 hover:text-white cursor-pointer transition-colors" />
                            <X className="w-3.5 h-3.5 hover:text-white cursor-pointer transition-colors" />
                          </div>
                        </div>
                      </div>
                    ) : null // Render nothing if there's no text (e.g., for an image-only message).
                  }
                </div>
              )}
            </div>

            {/* Upload status and placeholder */}
            {message.content.uploadStatus &&
              message.content.uploadStatus !== "none" &&
              !message.content.imageUrl && (
                <div className="mt-4 h-30 w-45 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-white/5">
                  {message.content.uploadStatus === "pending" && (
                    <div className="text-center text-gray-600 dark:text-gray-400">
                      <div className="animate-spin w-8 h-8 border-3 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full mx-auto mb-3"></div>
                      <div className="text-sm font-medium">
                        Uploading image...
                      </div>
                    </div>
                  )}
                  {message.content.uploadStatus === "sent" && (
                    <div className="text-center text-blue-600 dark:text-blue-400">
                      <div className="animate-pulse w-8 h-8 border-3 border-blue-500 dark:border-blue-400 rounded-full mx-auto mb-3"></div>
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

            {/* Actual image - show when available */}
            {message.content.imageUrl && (
              <Link
                href={`${
                  message.content.imageUrl.split("upload/")[0]
                }upload/fl_attachment:${message.content?.filename}/${
                  message.content.imageUrl.split("upload/")[1]
                }`}
              >
                <div className="my-2 h-45 w-45 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-sm transition-transform hover:scale-105">
                  <Image
                    width={300}
                    height={300}
                    src={message.content.imageUrl}
                    alt="Shared image"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
              </Link>
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
