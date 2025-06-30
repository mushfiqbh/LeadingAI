"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChatStore } from "@/hooks/useChatStore";
import { ChatMessage } from "@/types";

const API_ENDPOINT =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5000";

export const useChatApi = () => {
  const { user } = useAuth();
  const {
    selectedConversationId,
    addMessage,
    updateMessage,
    setMessages,
    messages,
  } = useChatStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const getStreamedResponse = async (prompt: ChatMessage) => {
    if (!selectedConversationId || !user?.uid) return;

    const formData = new FormData();
    formData.append("text", prompt.text);
    formData.append("conversationId", selectedConversationId);
    formData.append("userId", user.uid);
    if (prompt.image) {
      formData.append("image", prompt.image);
    }

    const response = await fetch(`${API_ENDPOINT}/chat`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const reader = response.body?.getReader();
    if (!reader) throw new Error("Response body is not readable");

    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let streamingText = "";
    let tempAiMessageId: string | null = null;

    setIsStreaming(true);
    setStatusMessage("Please wait");

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process all complete SSE messages in buffer
        while (buffer.includes("\n\n")) {
          const newlineIndex = buffer.indexOf("\n\n");
          const line = buffer.substring(0, newlineIndex).trim();
          buffer = buffer.substring(newlineIndex + 2);

          if (!line.startsWith("data: ")) continue;

          const dataStr = line.substring(5).trim();

          // Handle completion signals
          if (dataStr === "[DONE]") {
            return;
          }
          if (dataStr === "[ERROR]") {
            throw new Error("Server error during streaming");
          }

          // Handle status messages (raw strings)
          if (dataStr === "__thinking__") {
            setStatusMessage("🤔 Thinking");
            continue;
          }
          if (dataStr === "__requesting_mcp__") {
            setStatusMessage("🔗 Requesting MCP Server");
            continue;
          }

          // Check if message looks like JSON before trying to parse
          if (dataStr.startsWith("{") && dataStr.endsWith("}")) {
            try {
              const data = JSON.parse(dataStr);

              // Handle user message creation confirmation
              if (data.type === "message_ids" && data.userMessageId) {
                continue;
              }

              // Handle AI response chunks
              if (data.type === "chunk" && data.text) {
                streamingText += data.text;

                // Create or update temporary AI message in UI
                if (!tempAiMessageId) {
                  tempAiMessageId = `temp_ai_${Date.now()}`;
                  const tempMessage = {
                    id: tempAiMessageId,
                    role: "assistant" as const,
                    content: { text: streamingText, image: null },
                    timestamp: new Date(),
                    conversationId: selectedConversationId,
                    senderId: "system",
                  };
                  addMessage(selectedConversationId, tempMessage);
                } else {
                  // Update existing temporary message
                  updateMessage(selectedConversationId, tempAiMessageId, {
                    content: { text: streamingText, image: null },
                  });
                }
                continue;
              }

              // Handle completion with final message ID
              if (data.type === "complete" && data.aiMessageId) {
                setStatusMessage("");
                continue;
              }
            } catch (parseError) {
              console.warn("Invalid JSON message:", dataStr, parseError);
            }
          } else {
            // Handle non-JSON messages (raw strings)
            if (dataStr) {
              setStatusMessage(dataStr);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
      setIsStreaming(false);
      setStatusMessage("");
    }
  };

  const handleSendMessage = async (content: ChatMessage) => {
    if (!selectedConversationId || !user?.uid) return;

    setError(null);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);

    if (!selectedConversationId) return;

    // Get messages for the current conversation
    const currentMessages = messages[selectedConversationId] || [];

    if (currentMessages.length > 0) {
      // Find the last user message
      const lastUserMessage = [...currentMessages]
        .reverse()
        .find((msg) => msg.role === "user");

      if (lastUserMessage) {
        // Remove the last assistant message if it exists (including temp messages)
        const lastMessageIndex = currentMessages.length - 1;
        const lastMessage = currentMessages[lastMessageIndex];

        if (
          lastMessage &&
          (lastMessage.role === "assistant" ||
            lastMessage.id.startsWith("temp_"))
        ) {
          // Filter out the last message
          const updatedMessages = currentMessages.slice(0, -1);
          setMessages(selectedConversationId, updatedMessages);
        }

        // Retry sending the last user message
        handleSendMessage(lastUserMessage.content);
      }
    }
  };

  return {
    isLoading,
    isStreaming,
    error,
    statusMessage,
    handleSendMessage,
    handleRetry,
  };
};
