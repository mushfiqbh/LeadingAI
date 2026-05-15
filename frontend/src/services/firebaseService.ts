import { db } from "@/lib/firebaseClient";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { Conversation, Message } from "@/types/types";

// Create a new conversation in Firestore
export const createConversationInFirebase = async (
  conversation: Omit<Conversation, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const conversationData = {
      ...conversation,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, "conversations"),
      conversationData
    );

    return docRef.id;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

// Update a conversation in Firestore
export const updateConversationInFirebase = async (
  conversationId: string,
  updates: Partial<Omit<Conversation, "id" | "createdAt" | "updatedAt">>
): Promise<void> => {
  try {
    const conversationRef = doc(db, "conversations", conversationId);
    await updateDoc(conversationRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating conversation:", error);
    throw error;
  }
};

// Add a message to Firestore
export const addMessageToFirebase = async (
  message: Omit<Message, "id" | "timestamp">
): Promise<string> => {
  try {
    const messageData = {
      ...message,
      timestamp: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "messages"), messageData);

    // Update the conversation's lastMessage and updatedAt
    if (message.conversationId && message.senderId) {
      await updateConversationLastMessage(message.conversationId, {
        senderId: message.senderId,
        text: message.content.text,
      });
    }

    return docRef.id;
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
};

// Update conversation's last message and updatedAt
export const updateConversationLastMessage = async (
  conversationId: string,
  lastMessage: {
    senderId: string;
    text: string;
  }
): Promise<void> => {
  try {
    // Updating conversation with last message
    const conversationRef = doc(db, "conversations", conversationId);
    await updateDoc(conversationRef, {
      lastMessage,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating conversation:", conversationId, error);
    throw error;
  }
};

// Update a message in Firestore (for streaming updates)
export const updateMessageInFirebase = async (
  messageId: string,
  content: Message["content"]
): Promise<void> => {
  try {
    // Updating message in Firebase
    const messageRef = doc(db, "messages", messageId);
    await updateDoc(messageRef, {
      content,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("❌ Error updating message:", messageId, error);
    throw error;
  }
};
