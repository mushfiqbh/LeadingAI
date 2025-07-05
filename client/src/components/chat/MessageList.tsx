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
    if (messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage.content.text || !isStreaming) {
      scrollToBottom();
    }
  }, [messages, isStreaming]);

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message, index) => {
        const isLastMessage = index === messages.length - 1;
        const isAssistantMessage = message.role === "assistant";
        const isCurrentStreamingMessage =
          isStreaming && isLastMessage && isAssistantMessage;

        // Only pass statusMessage to the current streaming message
        const currentStatusMessage = isCurrentStreamingMessage
          ? statusMessage
          : "✋ Please wait";

        return (
          <MessageBubble
            key={message.id}
            message={message}
            isStreaming={isCurrentStreamingMessage}
            statusMessage={currentStatusMessage}
          />
        );
      })}

      {error && <ErrorMessage message={error} onRetry={onRetry} />}
      <div ref={messagesEndRef} />
    </div>
  );
};
