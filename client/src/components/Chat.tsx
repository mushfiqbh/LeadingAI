"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { ErrorMessage } from "./ErrorMessage";
import { ChatMessage, Message } from "../types";

const API_ENDPOINT =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5000";

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isStreaming]);

  const getStreamedResponse = async (prompt: Message) => {
    const formData = new FormData();
    formData.append("text", prompt.text);
    if (prompt.image) {
      formData.append("image", prompt.image);
    }

    const response = await fetch(API_ENDPOINT + "/chat", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is not readable");
    }

    const decoder = new TextDecoder("utf-8");
    let result = "";

    // Create initial AI message
    const messageId = (Date.now() + 1).toString();
    const aiMessage: ChatMessage = {
      id: messageId,
      role: "assistant",
      content: { text: "", image: null },
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setStreamingMessageId(messageId);
    setIsStreaming(true);

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n").filter(Boolean);

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.replace("data: ", "");
            if (data === "[DONE]") {
              setIsStreaming(false);
              setStreamingMessageId(null);
              return result;
            }

            result += data;

            // Update the streaming message in real-time
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === messageId
                  ? {
                      ...msg,
                      content: { text: result, image: null },
                    }
                  : msg
              )
            );
          }
        }
      }
    } finally {
      reader.releaseLock();
      setIsStreaming(false);
      setStreamingMessageId(null);
    }

    return result;
  };

  const handleSendMessage = async (content: Message) => {
    setError(null);

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      await getStreamedResponse(content);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again."
      );

      // Remove the empty AI message if there was an error
      if (streamingMessageId) {
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== streamingMessageId)
        );
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingMessageId(null);
    }
  };

  const handleRetry = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages]
        .reverse()
        .find((msg) => msg.role === "user");
      if (lastUserMessage) {
        // Remove the last assistant message if it exists and retry
        const lastMessageIndex = messages.length - 1;
        if (messages[lastMessageIndex]?.role === "assistant") {
          setMessages((prev) => prev.slice(0, -1));
        }
        handleSendMessage(lastUserMessage.content);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white/80 backdrop-blur-sm p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Lucid AI Assistant
            </h1>
            <p className="text-sm text-gray-500">
              Powered by OpenRouter Models
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Hello! I`m your AI assistant
              </h2>
              <p className="text-gray-600 mb-6">
                I can help you with questions, creative tasks, analysis, and
                more. You can also share images by URL for me to analyze.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3 text-left">
                  <p className="font-medium text-gray-900">
                    💬 Ask me anything
                  </p>
                  <p className="text-gray-600">
                    Questions, explanations, creative writing
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-left">
                  <p className="font-medium text-gray-900">🖼️ Analyze images</p>
                  <p className="text-gray-600">Share image URLs for analysis</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="pb-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isStreaming={isStreaming && message.id === streamingMessageId}
              />
            ))}
            {isLoading && !isStreaming && <TypingIndicator />}
            {error && <ErrorMessage message={error} onRetry={handleRetry} />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading || isStreaming}
        />
      </div>
    </div>
  );
};
