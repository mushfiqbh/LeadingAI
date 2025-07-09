import React, { useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { ErrorMessage } from "./ErrorMessage";
import { Message } from "@/types/types";

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
    <div className="flex flex-col gap-6 py-4 max-w-4xl mx-auto">
      {/* Chat Messages */}
      <div className="space-y-6">
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
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } px-2`}
            >
              <div
                className={`max-w-[85%] ${
                  message.role === "user" ? "order-2" : "order-1"
                }`}
              >
                <MessageBubble
                  message={message}
                  isStreaming={isCurrentStreamingMessage}
                  statusMessage={currentStatusMessage}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex justify-center px-2">
          <div className="max-w-[85%] md:max-w-[75%]">
            <ErrorMessage message={error} onRetry={onRetry} />
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} className="h-2" />
    </div>
  );
};
