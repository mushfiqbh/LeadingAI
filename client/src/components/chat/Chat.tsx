"use client";

import React, { useMemo, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChatStore } from "@/hooks/useChatStore";
import { useChatSession } from "@/hooks/useChatSession";
import { useChatApi } from "@/hooks/useChatApi";
import { ChatMessage } from "@/types";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { EmptyChat } from "./EmptyChat";
import { useChatListeners } from "@/hooks/useChatListeners";

const Chat: React.FC = () => {
  const { user } = useAuth();
  const { selectedConversationId, messages: storeMessages } = useChatStore();

  // Latency testing - track message send times
  const messageTimestamps = useRef<Map<string, number>>(new Map());
  const firstChunkTimestamps = useRef<Map<string, number>>(new Map());
  const lastMessageCount = useRef<number>(0);
  const lastStreamingState = useRef<boolean>(false);

  // Custom hooks to manage logic
  useChatListeners(user?.uid || "");
  useChatSession();

  const {
    isLoading,
    isStreaming,
    error,
    statusMessage,
    handleSendMessage,
    handleRetry,
  } = useChatApi();

  const currentMessages = useMemo(() => {
    return selectedConversationId
      ? storeMessages[selectedConversationId] || []
      : [];
  }, [selectedConversationId, storeMessages]);

  // Latency testing - wrap handleSendMessage to track timing
  const handleSendMessageWithLatency = useCallback(
    async (message: ChatMessage) => {
      const sendTime = performance.now();
      console.log("📤 Message sent at:", new Date().toISOString());
      console.log("⏱️ Starting latency timer...");

      // Store the send time - we'll use the conversation ID as key since we don't have message ID yet
      if (selectedConversationId) {
        messageTimestamps.current.set(selectedConversationId, sendTime);
      }

      return handleSendMessage(message);
    },
    [handleSendMessage, selectedConversationId]
  );

  // Latency testing - monitor for streaming start
  React.useEffect(() => {
    if (isStreaming && !lastStreamingState.current && selectedConversationId) {
      const sendTime = messageTimestamps.current.get(selectedConversationId);
      if (sendTime) {
        const firstChunkTime = performance.now();
        firstChunkTimestamps.current.set(
          selectedConversationId,
          firstChunkTime
        );

        const timeToFirstChunk = firstChunkTime - sendTime;
        console.log("🚀 First streaming chunk received!");
        console.log(
          "⚡ Time to first response:",
          timeToFirstChunk.toFixed(2),
          "ms"
        );
        console.log(
          "📊 TTFB (Time to First Byte):",
          (timeToFirstChunk / 1000).toFixed(2),
          "seconds"
        );
      }
    }
    lastStreamingState.current = isStreaming;
  }, [isStreaming, selectedConversationId]);

  // Latency testing - monitor for new AI responses
  React.useEffect(() => {
    const messageCount = currentMessages.length;

    // Check if a new message was added
    if (messageCount > lastMessageCount.current) {
      const latestMessage = currentMessages[messageCount - 1];

      // Check if the latest message is from assistant and has content
      if (
        latestMessage?.role === "assistant" &&
        latestMessage.content?.text &&
        selectedConversationId
      ) {
        const sendTime = messageTimestamps.current.get(selectedConversationId);

        if (sendTime) {
          const receiveTime = performance.now();
          const totalLatency = receiveTime - sendTime;
          const firstChunkTime = firstChunkTimestamps.current.get(
            selectedConversationId
          );

          console.log("🤖 AI Response completed at:", new Date().toISOString());
          console.log(
            "⚡ Total Message Latency:",
            totalLatency.toFixed(2),
            "ms"
          );
          console.log("📊 Detailed Latency breakdown:");
          console.log(
            "  - Total time:",
            (totalLatency / 1000).toFixed(2),
            "seconds"
          );

          if (firstChunkTime) {
            const streamingTime = receiveTime - firstChunkTime;
            const ttfb = firstChunkTime - sendTime;
            console.log(
              "  - Time to first byte (TTFB):",
              ttfb.toFixed(2),
              "ms"
            );
            console.log(
              "  - Streaming duration:",
              streamingTime.toFixed(2),
              "ms"
            );
            console.log(
              "  - Response processing:",
              (streamingTime / 1000).toFixed(2),
              "seconds"
            );
            firstChunkTimestamps.current.delete(selectedConversationId);
          }

          console.log(
            "  - Message length:",
            latestMessage.content.text.length,
            "characters"
          );
          console.log(
            "  - Content preview:",
            latestMessage.content.text.substring(0, 50) + "..."
          );
          console.log("🏁 Latency test completed");
          console.log("═".repeat(80));

          // Clean up the timestamps
          messageTimestamps.current.delete(selectedConversationId);
        }
      }
    }

    lastMessageCount.current = messageCount;
  }, [currentMessages, selectedConversationId]);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col bg-white rounded-md">
      <div className="flex-1 overflow-y-auto scroll-smooth p-4 mb-24">
        {currentMessages.length === 0 ? (
          <EmptyChat userName={user?.displayName?.split(" ")[0]} />
        ) : (
          <MessageList
            messages={currentMessages}
            isStreaming={isStreaming}
            statusMessage={statusMessage}
            error={error}
            onRetry={handleRetry}
          />
        )}
      </div>

      <div className="fixed w-full max-w-3xl mx-auto bottom-0 left-0 right-0 z-10 shadow-xl transition-transform">
        <ChatInput
          onSendMessage={handleSendMessageWithLatency}
          isLoading={isLoading || isStreaming}
        />
      </div>
    </div>
  );
};

export default Chat;
