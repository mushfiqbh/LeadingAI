"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Send, X, ImageUp } from "lucide-react";
import { ChatMessage } from "../../types/types";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState([
    "Check results",
    "Whats my CGPA",
    "Latest notice",
    "Find notes or PDFs",
    "What can you do",
    "Any upcoming events",
    "What's the bus schedule",
  ]);

  const baseSuggestions = [
    "Check my results",
    "Whats my CGPA",
    "Latest notice",
    "Find notes or PDFs",
    "What can you do",
    "Any upcoming events",
    "What's the bus schedule",
  ];

  // Shuffle function to randomize suggestions
  const shuffleSuggestions = () => {
    const shuffled = [...baseSuggestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setSuggestions(shuffled);
  };

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
    setShowSuggestions(true);
    shuffleSuggestions();

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
    <div className="bg-white/95 backdrop-blur-sm p-4 border-t border-gray-200/50">
      {/* Suggested Messages */}
      {showSuggestions && input.trim() === "" && !image && (
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2.5 text-sm bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-full hover:from-blue-100 hover:to-purple-100 transition-all duration-200 border border-blue-200/50 whitespace-nowrap flex-shrink-0 shadow-sm hover:shadow-md transform hover:scale-105"
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-4">
          <div className="relative inline-block max-w-xs">
            <Image
              width={200}
              height={150}
              src={imagePreview}
              alt="Preview"
              className="rounded-xl w-full h-auto object-cover border-2 border-gray-200/50 shadow-lg"
            />
            <button
              onClick={removeImage}
              type="button"
              className="absolute -top-2 -right-2 bg-white text-gray-600 rounded-full p-1.5 shadow-lg hover:text-red-500 hover:bg-red-50 transition-all duration-200 border border-gray-200"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        {/* Image Upload Button */}
        <label className="flex-shrink-0 group cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="p-3 text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 border border-gray-200/50 group-hover:border-blue-300 shadow-sm hover:shadow-md">
            <ImageUp className="w-5 h-5" />
          </div>
        </label>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(e.target.value.trim() === "");
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Prompt here..."
            className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200/50 rounded-xl scrollbar-hidden focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 resize-none min-h-[48px] max-h-[120px] placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-200"
            rows={1}
            disabled={isLoading}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading || (!input.trim() && !image)}
          className="flex-shrink-0 p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          title="Send message"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};
