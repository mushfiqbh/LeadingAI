"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChatStore } from "@/hooks/useChatStore";
import { ChatMessage } from "@/types/types";

const API_ENDPOINT =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5000";

export const useChatApi = () => {
  const { user } = useAuth();
  const {
    selectedConversationId,
    updateMessage,
    setMessages,
    messages,
    addMessageToFirebase,
  } = useChatStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const getStreamedResponse = async (
    prompt: ChatMessage,
    userMessageId: string,
    aiMessageId: string
  ) => {
    if (!selectedConversationId || !user?.uid || !prompt.text) return;

    const formData = new FormData();
    formData.append("text", prompt.text);
    formData.append("conversationId", selectedConversationId);
    formData.append("userId", user.uid);
    formData.append("userMessageId", userMessageId);
    formData.append("aiMessageId", aiMessageId); // Send the real AI message ID
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

    const decoder = new TextDecoder();
    let buffer = "";
    let streamingText = "";
    let wordBuffer = ""; // Buffer for word-by-word streaming

    setIsStreaming(true);

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk properly with stream option
        buffer += decoder.decode(value, { stream: true });

        // Process all complete SSE messages
        while (buffer.includes("\n\n")) {
          const idx = buffer.indexOf("\n\n");
          const fullLine = buffer.slice(0, idx).trim();
          buffer = buffer.slice(idx + 2);

          if (!fullLine.startsWith("data: ")) continue;

          const data = fullLine.slice(6);

          if (data === "[DONE]") {
            return;
          }

          if (data === "[ERROR]") {
            throw new Error("Server error during streaming");
          }

          if (data === "__thinking__") {
            setStatusMessage("🤔 Thinking");
            continue;
          }

          if (data === "__calling_mcp__") {
            setStatusMessage("🔗 Calling MCP Server");
            continue;
          }

          // Clear status message when we start receiving actual content
          if (statusMessage && statusMessage !== "") {
            setStatusMessage("");
          }

          // Add characters to word buffer for smoother streaming
          wordBuffer += data;

          // Check if we should update the display (on word boundaries or after some characters)
          // Preserve all newlines and whitespace in the buffer
          const shouldUpdate =
            /[\s\n\r\t,.!?;:]/.test(data) || wordBuffer.length >= 10;

          if (shouldUpdate) {
            // Update streaming text with the buffered content (preserving all characters including \n\n)

            streamingText += wordBuffer;
            wordBuffer = ""; // Reset buffer

            // Update the real AI message with streaming content
            updateMessage(selectedConversationId, aiMessageId, {
              content: { text: streamingText, image: null },
            });
          }
        }
      }

      // Handle any remaining content in word buffer
      if (wordBuffer) {
        streamingText += wordBuffer;
        updateMessage(selectedConversationId, aiMessageId, {
          content: { text: streamingText, image: null },
        });
      }
    } finally {
      reader.releaseLock();
      setStatusMessage(""); // Clear FIRST
      setIsStreaming(false); // Then stop streaming
    }
  };

  const handleSendMessage = async (content: ChatMessage) => {
    if (!selectedConversationId || !user?.uid) return;

    setError(null);
    setIsLoading(true);

    try {
      // 1. Create user message in Firebase (frontend)
      const userMessageId = await addMessageToFirebase({
        role: "user",
        content: {
          text: content.text,
          image: null, // Image is null in Firebase, handled in backend
          uploadStatus: content.uploadStatus,
        },
        conversationId: selectedConversationId,
        senderId: user.uid,
      });

      // 2. Create empty AI message in Firebase (frontend)
      const aiMessageId = await addMessageToFirebase({
        role: "assistant",
        content: { text: "", image: null },
        conversationId: selectedConversationId,
        senderId: "system",
      });

      // 3. Stream AI response and update the real AI message
      await getStreamedResponse(content, userMessageId, aiMessageId);
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
        // Remove the last assistant message if it exists
        const lastMessageIndex = currentMessages.length - 1;
        const lastMessage = currentMessages[lastMessageIndex];

        if (lastMessage && lastMessage.role === "assistant") {
          // Filter out the last AI message
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
