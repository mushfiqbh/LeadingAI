"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Send, X, ImageUp } from "lucide-react";
import { Message } from "../../types";

interface ChatInputProps {
  onSendMessage: (messages: Message) => void;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() && !image) return;

    adjustTextareaHeight();

    const message: Message = {
      text: input.trim(),
      image: image || null,
    };

    onSendMessage(message);
    setInput("");
    setImage(null);
    setImagePreview(null);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="bg-white p-4">
      {imagePreview && (
        <div className="relative max-w-xs">
          <Image
            width={10}
            height={10}
            src={imagePreview}
            alt="Preview"
            className="rounded-lg w-full h-auto object-cover border"
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
            disabled={isLoading}
          />
          <ImageUp className="w-5 h-5" />
        </label>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            adjustTextareaHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Prompt here..."
          className="w-full px-4 py-3 pr-12 text-gray-900 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[48px] max-h-[120px] placeholder-gray-500"
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
