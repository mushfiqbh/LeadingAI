import { create } from "zustand";
import { Conversation, Message } from "@/types";
import {
  createConversationInFirebase as createConversationInDB,
  addMessageToFirebase as addMessageToDB,
} from "@/services/firebaseService";

type ChatStore = {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  selectedConversationId: string | null;
  areConversationsLoading: boolean;

  setConversations: (conversations: Conversation[]) => void;
  createConversationInFirebase: (
    conversation: Omit<Conversation, "id" | "createdAt" | "updatedAt">
  ) => Promise<string>;
  selectConversation: (id: string | null) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  updateMessage: (
    conversationId: string,
    messageId: string,
    updates: Partial<Message>
  ) => void;
  addMessageToFirebase: (
    message: Omit<Message, "id" | "timestamp">
  ) => Promise<string>;
};

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  messages: {},
  selectedConversationId: null,
  areConversationsLoading: true,

  setConversations: (conversations) =>
    set({
      conversations,
      areConversationsLoading: false,
    }),

  createConversationInFirebase: async (conversationData) => {
    try {
      // Don't pass any temporary ID, let Firebase generate the real one
      const conversationId = await createConversationInDB(conversationData);

      // The real-time listener will update the store when Firebase creates the conversation
      return conversationId;
    } catch (error) {
      console.error("Error creating conversation in Firebase:", error);
      throw error;
    }
  },

  selectConversation: (id) => set({ selectedConversationId: id }),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages },
    })),

  updateMessage: (conversationId, messageId, updates) =>
    set((state) => {
      const currentMessages = state.messages[conversationId] || [];
      const messageIndex = currentMessages.findIndex(
        (msg) => msg.id === messageId
      );

      if (messageIndex === -1) return state;

      const updatedMessages = [...currentMessages];
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        ...updates,
        content: {
          ...updatedMessages[messageIndex].content,
          ...(updates.content || {}),
        },
      };

      return {
        messages: {
          ...state.messages,
          [conversationId]: updatedMessages,
        },
      };
    }),

  addMessageToFirebase: async (messageData) => {
    try {
      // Don't pass any temporary ID, let Firebase generate the real one
      const messageId = await addMessageToDB(messageData);

      // The real-time listener will update the store when Firebase creates the message
      return messageId;
    } catch (error) {
      console.error("Error adding message to Firebase:", error);
      throw error;
    }
  },
}));
