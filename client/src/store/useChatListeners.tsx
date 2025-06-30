import { useEffect } from "react";
import { db } from "@/lib/firebaseClient";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useChatStore } from "./useChatStore";
import { Conversation, Message } from "@/types";

export function useChatListeners(userId: string) {
  const setConversations = useChatStore((state) => state.setConversations);
  const setMessages = useChatStore((state) => state.setMessages);

  // Listen to conversations for this user
  useEffect(() => {
    if (!userId) return; // Don't listen if no user ID

    console.log("👤 Setting up conversation listener for user:", userId);

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", userId),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Conversation[];

      console.log("📋 Conversations updated:", convos.length, "conversations");
      setConversations(convos);
    });

    return () => unsubscribe();
  }, [userId, setConversations]);

  // Listen to messages for selected conversation
  const selectedConversationId = useChatStore(
    (state) => state.selectedConversationId
  );

  useEffect(() => {
    if (!selectedConversationId) return;

    console.log(
      "💬 Setting up message listener for conversation:",
      selectedConversationId
    );

    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", selectedConversationId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firebaseMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as Message[];

      console.log(
        `📨 Messages updated for conversation ${selectedConversationId}:`,
        firebaseMessages.length,
        "messages"
      );

      // Get current messages to check for temp messages
      const currentMessages =
        useChatStore.getState().messages[selectedConversationId] || [];

      // Check if we have temp messages that need to be replaced
      const hasTempMessages = currentMessages.some((msg) =>
        msg.id.startsWith("temp_")
      );

      // Always update with Firebase messages (this will replace temp messages)
      setMessages(selectedConversationId, firebaseMessages);

      if (hasTempMessages && firebaseMessages.length > 0) {
        console.log("🔄 Replaced temporary messages with Firebase messages");
      }
    });

    return () => unsubscribe();
  }, [selectedConversationId, setMessages]);
}
