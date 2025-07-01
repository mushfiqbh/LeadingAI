import React, { useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { ErrorMessage } from "./ErrorMessage";
import { Message } from "@/types";

interface MessageListProps {
  messages: Message[];
  isStreaming: boolean;
  statusMessage: string;
  error: string | null;
  onRetry: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isStreaming,
  statusMessage,
  error,
  onRetry,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message, index) => {
        const isLastMessage = index === messages.length - 1;
        const isAssistantMessage = message.role === "assistant";
        const isCurrentStreamingMessage =
          isStreaming && isLastMessage && isAssistantMessage;
        
        // Only pass statusMessage to the current streaming message
        const currentStatusMessage = isCurrentStreamingMessage ? statusMessage : "";

        return (
          <MessageBubble
            key={message.id}
            message={message}
            isStreaming={isCurrentStreamingMessage}
            statusMessage={currentStatusMessage}
          />
        );
      })}

      {/* Show status bubble when streaming but no AI message exists yet */}
      {isStreaming && statusMessage && messages.length > 0 && 
       messages[messages.length - 1].role !== "assistant" && (
        <MessageBubble
          key="status-loading"
          message={{
            id: "status-loading",
            role: "assistant" as const,
            content: { text: "", image: null },
            timestamp: new Date(),
            conversationId: "",
            senderId: "system",
          }}
          isStreaming={true}
          statusMessage={statusMessage}
        />
      )}

      {error && <ErrorMessage message={error} onRetry={onRetry} />}
      <div ref={messagesEndRef} />
    </div>
  );
};
