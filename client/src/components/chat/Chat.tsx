"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { ErrorMessage } from "./ErrorMessage";
import { ChatMessage, Message } from "../../types";
import { useAuth } from "@/context/authContext";

const API_ENDPOINT =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5000";

export const Chat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

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
              setStatusMessage("");
              return result;
            }

            // 🔁 Check for control signals from the backend
            if (data === "__thinking__") {
              setStatusMessage("Thinking");
              continue;
            }
            if (data === "__requesting_mcp__") {
              setStatusMessage("Requesting MCP Server");
              continue;
            }

            // 🔁 Actual content streaming
            result += data;

            setStatusMessage("Please wait"); // clear any prior status
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
    }

    return result;
  };

  const handleSendMessage = async (content: Message) => {
    setError(null);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true); // Start loading

    try {
      await getStreamedResponse(content);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again."
      );

      // Remove streaming message only if it exists
      setMessages((prev) =>
        streamingMessageId
          ? prev.filter((msg) => msg.id !== streamingMessageId)
          : prev
      );
    } finally {
      setIsLoading(false); // End loading
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
    <div className="w-full max-w-3xl mx-auto flex flex-col bg-white rounded-md">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto scroll-smooth p-4 mb-24"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Hello! {user?.displayName?.split(" ")[0] || "Anonymous"} 👋
              </h2>
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
                  <p className="font-medium text-gray-900">
                    📚 Find and explore
                  </p>
                  <p className="text-gray-600">
                    Get class, exam, results and academic information
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-left">
                  <p className="font-medium text-gray-900">
                    🔍 Download Documents
                  </p>
                  <p className="text-gray-600">
                    Search any notes, documents and files from lucse google
                    drive
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-left">
                  <p className="font-medium text-gray-900">🖼️ Analyze images</p>
                  <p className="text-gray-600">Upload image for explanation</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message) => {
              if (isLoading && message.id === streamingMessageId) {
                return;
              }

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isStreaming={isStreaming && message.id === streamingMessageId}
                />
              );
            })}

            {(isLoading) && (
              <TypingIndicator statusMessage={statusMessage} />
            )}
            
            {error && <ErrorMessage message={error} onRetry={handleRetry} />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="fixed w-full max-w-3xl mx-auto bottom-0 left-0 right-0 z-10">
        {/* <div className="flex justify-center mb-2 bg-transparent">
          <button
            onClick={stopStreaming}
            className="w-fit cursor-pointer bg-teal-500 text-sm text-white p-2 rounded-md hover:bg-teal-400 transition-colors"
            hidden={!isStreaming}
          >
            Stop Streaming
          </button>
        </div> */}

        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading || isStreaming}
        />
      </div>
    </div>
  );
};
