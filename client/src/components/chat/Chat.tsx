"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { MessageBubble } from "./MessageBubble";
import { ErrorMessage } from "./ErrorMessage";
import { ChatMessage } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { ChatInput } from "./ChatInput";
import { useChatListeners } from "@/store/useChatListeners";
import { useChatStore } from "@/store/useChatStore";

const API_ENDPOINT =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:5000";

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const Chat: React.FC = () => {
  const { user } = useAuth();

  // Zustand store hooks
  const {
    conversations,
    selectedConversationId,
    messages: storeMessages,
    createConversationInFirebase,
    selectConversation,
  } = useChatStore();

  // Initialize chat listeners with user ID
  useChatListeners(user?.uid || "");

  // Get messages for the current conversation
  const currentMessages = useMemo(() => {
    return selectedConversationId
      ? storeMessages[selectedConversationId] || []
      : [];
  }, [selectedConversationId, storeMessages]);

  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [inputFocused, setInputFocused] = useState<boolean>(false);

  // Session management
  const getSessionKey = (userId: string) => `chat_session_${userId}`;

  const initializeSession = useCallback(async () => {
    if (!user?.uid) return;

    const sessionKey = getSessionKey(user.uid);
    const storedSession = localStorage.getItem(sessionKey);

    if (storedSession) {
      try {
        const { conversationId, timestamp } = JSON.parse(storedSession);
        const now = Date.now();

        // Check if session is still valid (within 24 hours)
        if (now - timestamp < SESSION_DURATION) {
          // Session is valid, select the existing conversation
          const existingConversation = conversations.find(
            (c) => c.id === conversationId
          );
          if (existingConversation) {
            selectConversation(conversationId);
            return;
          }
        }
      } catch (error) {
        console.error("Error parsing stored session:", error);
      }
    }

    // No valid session or conversation not found, create new conversation or select the last one
    if (conversations.length > 0) {
      // Select the most recent conversation
      const latestConversation = conversations[0]; // conversations are ordered by updatedAt desc
      selectConversation(latestConversation.id);

      // Update session
      localStorage.setItem(
        sessionKey,
        JSON.stringify({
          conversationId: latestConversation.id,
          timestamp: Date.now(),
        })
      );
    } else {
      // Create a new conversation in Firebase
      const newConversationData = {
        participants: [user.uid],
        messages: [],
        lastMessage: null,
        userId: user.uid,
      };

      try {
        const conversationId = await createConversationInFirebase(
          newConversationData
        );
        selectConversation(conversationId);

        // Store session
        localStorage.setItem(
          sessionKey,
          JSON.stringify({
            conversationId,
            timestamp: Date.now(),
          })
        );
      } catch (error) {
        console.error("Error creating conversation:", error);
      }
    }
  }, [
    user?.uid,
    conversations,
    selectConversation,
    createConversationInFirebase,
  ]);

  // Initialize session when user changes or conversations load
  useEffect(() => {
    if (user?.uid && conversations !== undefined) {
      initializeSession();
    }
  }, [user?.uid, conversations, initializeSession]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isStreaming]);

  const getStreamedResponse = async (prompt: ChatMessage) => {
    if (!selectedConversationId || !user?.uid) return;

    console.log("🚀 Sending message to backend:", {
      text: prompt.text.substring(0, 50) + "...",
      conversationId: selectedConversationId,
      userId: user.uid,
      hasImage: !!prompt.image,
    });

    const formData = new FormData();
    formData.append("text", prompt.text);
    formData.append("conversationId", selectedConversationId);
    formData.append("userId", user.uid);
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
              setStatusMessage("");
              return;
            }

            if (data === "[ERROR]") {
              setIsStreaming(false);
              setStatusMessage("");
              throw new Error("Server error during streaming");
            }

            if (data === "__thinking__") {
              setStatusMessage("Thinking");
              continue;
            }

            if (data === "__requesting_mcp__") {
              setStatusMessage("Requesting MCP Server");
              continue;
            }

            // Try to parse as JSON for message IDs
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "message_ids") {
                console.log("Message IDs received:", parsed);
                continue;
              }
            } catch {
              // Not JSON, treat as regular text chunk
            }

            // When actual text arrives, clear the status message
            setStatusMessage("");

            // Note: We don't need to update local state here anymore
            // The Firebase listeners will automatically update the UI
            // This streaming is now just for real-time visual feedback
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

    // 1. Immediately add user message to UI (optimistic update)
    const tempUserMessage = {
      id: `temp_${Date.now()}`, // Temporary ID
      role: "user" as const,
      content,
      timestamp: new Date(),
      conversationId: selectedConversationId,
      senderId: user.uid,
    };

    // Add to Zustand store immediately
    const { addMessage } = useChatStore.getState();
    addMessage(selectedConversationId, tempUserMessage);

    try {
      // 2. Send to backend (which handles Firebase)
      await getStreamedResponse(content);
    } catch (err) {
      // 3. If error, remove the optimistic message
      const currentMessages =
        useChatStore.getState().messages[selectedConversationId] || [];
      const filteredMessages = currentMessages.filter(
        (msg) => msg.id !== tempUserMessage.id
      );
      useChatStore
        .getState()
        .setMessages(selectedConversationId, filteredMessages);

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
    if (!selectedConversationId) return;

    const currentConvMessages = storeMessages[selectedConversationId] || [];
    if (currentConvMessages.length > 0) {
      const lastUserMessage = [...currentConvMessages]
        .reverse()
        .find((msg) => msg.role === "user");
      if (lastUserMessage) {
        // Remove the last assistant message if it exists and retry
        const lastMessageIndex = currentConvMessages.length - 1;
        if (currentConvMessages[lastMessageIndex]?.role === "assistant") {
          const updatedMessages = currentConvMessages.slice(0, -1);
          useChatStore
            .getState()
            .setMessages(selectedConversationId, updatedMessages);
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
        {/* ... (empty message state is the same) */}
        {currentMessages.length === 0 ? (
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
            {currentMessages.map((message, index) => {
              // Show streaming indicator on the last assistant message when streaming
              const isLastMessage = index === currentMessages.length - 1;
              const isAssistantMessage = message.role === "assistant";
              const isCurrentStreamingMessage =
                isStreaming && isLastMessage && isAssistantMessage;

              // Pass status message only to the currently streaming bubble
              const currentStatusMessage = isCurrentStreamingMessage
                ? statusMessage
                : "";

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isStreaming={isCurrentStreamingMessage}
                  statusMessage={currentStatusMessage}
                />
              );
            })}

            {error && <ErrorMessage message={error} onRetry={handleRetry} />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div
        className={`fixed w-full max-w-3xl mx-auto bottom-0 left-0 right-0 z-10 shadow-xl transition-transform ${
          inputFocused ? "-translate-y-44" : "translate-y-0"
        }`}
      >
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading || isStreaming}
          setInputFocused={setInputFocused}
        />
      </div>
    </div>
  );
};

export default Chat;
