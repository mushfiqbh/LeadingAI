"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ImageUp, Send, X } from "lucide-react";
import { ChatMessage } from "../../types/types";
import { useAuth } from "@/context/AuthContext";

interface ChatInputProps {
  onSendMessage: (messages: ChatMessage) => void;
  isLoading: boolean;
  inputValue?: string;
  onInputChange?: (value: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  inputValue,
  onInputChange,
}) => {
  const { userProfile, setShowManager } = useAuth();
  const [internalInput, setInternalInput] = useState("");
  
  const input = inputValue !== undefined ? inputValue : internalInput;
  const setInput = useCallback((value: string) => {
    if (onInputChange) {
      onInputChange(value);
    } else {
      setInternalInput(value);
    }
  }, [onInputChange]);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState([
    "Check results",
    "Latest notice",
    "Create class routine",
    "Create exam routine",
    "Google drive pdf",
    "What can you do",
    "Any upcoming events",
    "Whats my CGPA",
  ]);

  const SESSION_STORAGE_KEY = "chat-input-draft";

  // Load saved input from session storage on component mount
  useEffect(() => {
    const savedInput = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (savedInput && savedInput.trim() !== "") {
      setInput(savedInput);
      setShowSuggestions(false);
      // Adjust textarea height after setting input
      setTimeout(() => {
        adjustTextareaHeight();
        textareaRef.current?.focus();
        // Clear session storage so it doesn't persist if they leave and come back cleanly? 
        // Or keep it? The prompt implies "typing... opens chat". 
        // If they navigate back and forth, maybe clear it?
        // But for now, focusing is key.
      }, 0);
    }
  }, [setInput]);

  // Save input to session storage whenever it changes
  const handleInputChange = (value: string) => {
    setInput(value);
    setShowSuggestions(value.trim() === "");

    // Save to session storage
    if (value.trim() !== "") {
      sessionStorage.setItem(SESSION_STORAGE_KEY, value);
    } else {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }

    adjustTextareaHeight();
  };

  const baseSuggestions = [
    "Check my results",
    "Whats my CGPA",
    "Latest notice",
    "Create class routine",
    "Create exam routine",
    "Google drive pdf",
    "What can you do",
    "Any upcoming events",
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

    const creditsBalance =
      Number(userProfile?.totalCredits) - Number(userProfile?.usedCredits);

    if (creditsBalance <= 0) {
      setShowManager(true);
      return;
    }

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

    // Remove draft from session storage after successful submission
    sessionStorage.removeItem(SESSION_STORAGE_KEY);

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
   <div className="bg-transparent p-0">
  {/* Suggested Messages */}
  {showSuggestions && input.trim() === "" && !image && (
    <div className="mb-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1 px-1">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            type="button"
            className="px-4 py-1.5 text-xs bg-[#1a1a1a] text-gray-400 rounded-full border border-white/5 whitespace-nowrap
                       hover:bg-[#252525] hover:text-white transition-all duration-150"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )}

  {/* Image Preview */}
  {imagePreview && (
    <div className="mb-3 px-2">
      <div className="relative inline-block">
        <Image
          width={120}
          height={80}
          src={imagePreview}
          alt="Preview"
          className="rounded-lg border border-white/10 opacity-80"
        />
        <button
          onClick={removeImage}
          type="button"
          title="Remove image"
          className="absolute -top-1.5 -right-1.5 bg-[#1a1a1a] text-gray-400 rounded-full p-1 border border-white/10
                     hover:text-red-400 transition-colors shadow-lg"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  )}

  {/* Input Form */}
  <form
    onSubmit={handleSubmit}
    className="relative flex items-end gap-1 px-1.5 py-1.5 sm:px-2 sm:py-2 bg-[#1a1a1a] border border-white/10 rounded-3xl sm:rounded-[28px] shadow-2xl focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all group"
  >
    {/* Image Upload */}
    <label className="p-2.5 sm:p-3 text-gray-500 hover:text-gray-200 cursor-pointer transition-colors hover:bg-white/5 rounded-full shrink-0">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        disabled={isLoading}
      />
      <ImageUp className="w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform group-hover:scale-105" />
    </label>

    {/* Text Input */}
    <textarea
      ref={textareaRef}
      value={input}
      onChange={(e) => handleInputChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Start typing..."
      rows={1}
      disabled={isLoading}
      className="flex-1 px-1 sm:px-2 py-2 sm:py-2.5 text-gray-200 bg-transparent border-none rounded-xl resize-none
                 focus:outline-none focus:ring-0 min-h-10 max-h-30 sm:max-h-40
                 placeholder-gray-600 transition text-sm sm:text-[15px] leading-relaxed"
    />

    {/* Send Button */}
    <button
      type="submit"
      disabled={isLoading || (!input.trim() && !image)}
      title="Send message"
      className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all shrink-0 ${
        (input.trim() || image) && !isLoading
          ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20"
          : "bg-white/5 text-gray-600"
      }`}
    >
      {isLoading ? (
        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <Send className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${(input.trim() || image) ? "-mr-px sm:-mr-0.5px -mt-px" : ""}`} />
      )}
    </button>
  </form>
</div>
  );
};
