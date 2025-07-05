"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Send, X, ImageUp } from "lucide-react";
import { ChatMessage } from "../../types";

interface ChatInputProps {
  onSendMessage: (messages: ChatMessage) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [input, setInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sample suggested messages
  const suggestions = [
    "Check my result",
    "Latest university notices",
    "Create my class routine",
    "Generate exam schedule",
    "Find notes and pdfs",
    "What can you do?",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
    setTimeout(() => {
      adjustTextareaHeight();
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() && !image) return;

    const message: ChatMessage = {
      text: input.trim(),
      image: image || null,
      uploadStatus: image ? "pending" : "none",
    };

    onSendMessage(message);
    setInput("");
    setImage(null);
    setImagePreview(null);
    setShowSuggestions(true); // Show suggestions again after sending

    // Reset textarea height after clearing input
    setTimeout(() => {
      adjustTextareaHeight();
    }, 0);
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
      const newHeight = textarea.scrollHeight;
      // Reset to minimum height if content is empty or very small
      if (newHeight <= 48 || textarea.value.trim() === "") {
        textarea.style.height = "48px";
      } else {
        textarea.style.height = `${Math.min(newHeight, 120)}px`;
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      textareaRef.current?.focus();
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="bg-white p-2 pb-4">
      {/* Suggested Messages */}
      {showSuggestions && input.trim() === "" && !image && (
        <div className="mb-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 border border-gray-200 whitespace-nowrap flex-shrink-0"
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {imagePreview && (
        <div className="relative max-w-xs">
          <Image
            width={10}
            height={10}
            src={imagePreview}
            alt="Preview"
            className="rounded-lg w-full h-auto object-cover border mb-2"
          />
          <button
            onClick={removeImage}
            type="button"
            className="absolute top-1 right-1 bg-white text-gray-600 rounded-full p-1 shadow hover:text-red-500"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between gap-3"
      >
        <label className="block text-blue-600 p-2 rounded-full hover:bg-slate-200 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <ImageUp className="w-5 h-5" />
        </label>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(e.target.value.trim() === ""); // Hide suggestions when typing
            adjustTextareaHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Prompt here..."
          className="w-full px-4 py-3 pr-12 text-gray-900 bg-white border border-gray-300 rounded-xl scrollbar-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[48px] max-h-[120px] placeholder-gray-500"
          rows={1}
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading || (!input.trim() && !image)}
          className="flex-shrink-0 p-3 cursor-pointer bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
