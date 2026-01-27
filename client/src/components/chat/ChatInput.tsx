"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ImageUp, Send, X } from "lucide-react";
import { ChatMessage } from "../../types/types";
import { useAuth } from "@/context/AuthContext";

interface ChatInputProps {
  onSendMessage: (messages: ChatMessage) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const { userProfile, setShowManager } = useAuth();
  const [input, setInput] = useState("");
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
  }, []);

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
   <div className="bg-white/90 backdrop-blur p-4 border-t border-gray-200">
  {/* Suggested Messages */}
  {showSuggestions && input.trim() === "" && !image && (
    <div className="mb-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            type="button"
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full border border-gray-200 whitespace-nowrap
                       hover:bg-gray-200 transition-colors duration-150"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )}

  {/* Image Preview */}
  {imagePreview && (
    <div className="mb-3">
      <div className="relative inline-block max-w-xs">
        <Image
          width={200}
          height={150}
          src={imagePreview}
          alt="Preview"
          className="rounded-lg border border-gray-200"
        />
        <button
          onClick={removeImage}
          type="button"
          title="Remove image"
          className="absolute -top-2 -right-2 bg-white text-gray-500 rounded-full p-1 border border-gray-200
                     hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )}

  {/* Input Form */}
  <form
    onSubmit={handleSubmit}
    className="flex items-end gap-2 rounded-2xl bg-gray-50 p-2 border border-gray-200 focus-within:border-blue-400 transition-colors"
  >
    {/* Image Upload */}
    <label className="p-2 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        disabled={isLoading}
      />
      <ImageUp className="w-5 h-5" />
    </label>

    {/* Text Input */}
    <textarea
      ref={textareaRef}
      value={input}
      onChange={(e) => handleInputChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Prompt here..."
      rows={1}
      disabled={isLoading}
      className="flex-1 px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-xl resize-none
                 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[48px] max-h-[160px]
                 placeholder-gray-400 transition"
    />

    {/* Send Button */}
    <button
      type="submit"
      disabled={isLoading || (!input.trim() && !image)}
      title="Send message"
      className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-600 text-white
                 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <Send className="w-5 h-5" />
      )}
    </button>
  </form>
</div>
  );
};
