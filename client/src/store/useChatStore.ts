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

  setConversations: (conversations: Conversation[]) => void;
  createConversation: (conversation: Conversation) => void;
  createConversationInFirebase: (
    conversation: Omit<Conversation, "id" | "createdAt" | "updatedAt">
  ) => Promise<string>;
  selectConversation: (id: string | null) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  addMessageToFirebase: (
    message: Omit<Message, "id" | "timestamp">
  ) => Promise<string>;
};

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  messages: {},
  selectedConversationId: null,

  setConversations: (conversations) => set({ conversations }),

  createConversation: (conversation) =>
    set((state) => ({
      conversations: [...state.conversations, conversation],
      selectedConversationId: conversation.id,
      messages: { ...state.messages, [conversation.id]: [] },
    })),

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

  addMessage: (conversationId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message],
      },
    })),

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
