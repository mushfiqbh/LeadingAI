"use client";

import React, { useMemo, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChatStore } from "@/hooks/useChatStore";
import { useChatSession } from "@/hooks/useChatSession";
import { useChatApi } from "@/hooks/useChatApi";
import { ChatMessage } from "@/types/types";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { EmptyChat } from "./EmptyChat";
import { useChatListeners } from "@/hooks/useChatListeners";
import History from "../general/History";

const Chat: React.FC = () => {
  const { user, showHistory } = useAuth();
  const { selectedConversationId, messages: storeMessages } = useChatStore();

  // TTFB testing - track message send timeSlots
  const messageTimestamps = useRef<Map<string, number>>(new Map());
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

  // TTFB testing - wrap handleSendMessage to track timing
  const handleSendMessageWithLatency = useCallback(
    async (message: ChatMessage) => {
      const sendTime = performance.now();

      // Store the send time - we'll use the conversation ID as key since we don't have message ID yet
      if (selectedConversationId) {
        messageTimestamps.current.set(selectedConversationId, sendTime);
      }

      return handleSendMessage(message);
    },
    [handleSendMessage, selectedConversationId]
  );

  // TTFB testing - monitor for streaming start
  React.useEffect(() => {
    if (isStreaming && !lastStreamingState.current && selectedConversationId) {
      const sendTime = messageTimestamps.current.get(selectedConversationId);
      if (sendTime) {
        const firstChunkTime = performance.now();
        const timeToFirstChunk = firstChunkTime - sendTime;
        console.log("TTFB:", timeToFirstChunk.toFixed(2), "ms");

        // Clean up the timestamp
        messageTimestamps.current.delete(selectedConversationId);
      }
    }
    lastStreamingState.current = isStreaming;
  }, [isStreaming, selectedConversationId]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-full bg-gradient-to-br from-gray-50/50 via-white/30 to-blue-50/30 rounded-xl shadow-lg border border-white/20">
      <div className="flex-1 overflow-y-auto scroll-smooth p-2 mb-32 min-h-0">
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

      <div className="fixed w-full max-w-5xl mx-auto bottom-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm border-t border-gray-200/50 shadow-2xl">
        <ChatInput
          onSendMessage={handleSendMessageWithLatency}
          isLoading={isLoading || isStreaming}
        />
      </div>

      {showHistory && <History />}
    </div>
  );
};

export default Chat;
