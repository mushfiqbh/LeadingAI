"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Send, ImageIcon, Paperclip } from "lucide-react";
import { Message } from "../types";

interface ChatInputProps {
  onSendMessage: (messages: Message[]) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() && !imageUrl.trim()) return;

    const messages: Message[] = [];

    if (input.trim()) {
      messages.push({
        type: "text",
        text: input.trim(),
      });
    }

    if (imageUrl.trim()) {
      messages.push({
        type: "image_url",
        image_url: {
          url: imageUrl.trim(),
        },
      });
    }

    onSendMessage(messages);
    setInput("");
    setImageUrl("");
    setShowImageInput(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {showImageInput && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Add Image URL
            </span>
          </div>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL..."
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
          />
          {imageUrl && (
            <div className="mt-2">
              <Image
                width={100}
                height={100}
                src={imageUrl}
                alt="Preview"
                className="max-h-20 rounded border"
                onError={() => setImageUrl("")}
              />
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Message AI assistant..."
            className="w-full px-4 py-3 pr-12 text-gray-900 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[48px] max-h-[120px] placeholder-gray-500"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowImageInput(!showImageInput)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Add image"
          >
            <Paperclip className="w-4 h-4" />
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading || (!input.trim() && !imageUrl.trim())}
          className="flex-shrink-0 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};