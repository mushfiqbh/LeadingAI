"use client";

import React, { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChatStore } from "@/hooks/useChatStore";
import { useChatSession } from "@/hooks/useChatSession";
import { useChatApi } from "@/hooks/useChatApi";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { EmptyChat } from "./EmptyChat";
import { useChatListeners } from "@/hooks/useChatListeners";

const Chat: React.FC = () => {
  const { user } = useAuth();
  const { selectedConversationId, messages: storeMessages } = useChatStore();

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

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col bg-white rounded-md h-full">
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
          onSendMessage={handleSendMessage}
          isLoading={isLoading || isStreaming}
        />
      </div>
    </div>
  );
};

export default Chat;
