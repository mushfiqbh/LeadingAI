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
  const { setConversations, setMessages, selectedConversationId } =
    useChatStore();

  // Listen to conversations for this user
  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", userId),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const convos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Conversation[];

        setConversations(convos);
      },
      (error) => {
        console.error("❌ Error fetching conversations:", error);
      }
    );

    return () => unsubscribe();
  }, [userId, setConversations]);

  // Listen to messages for selected conversation
  useEffect(() => {
    if (!selectedConversationId) return;

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

      // Get current messages to handle temp message replacement
      const currentMessages =
        useChatStore.getState().messages[selectedConversationId] || [];

      // Check if we have temp AI messages that should be replaced
      const tempAiMessages = currentMessages.filter((msg) =>
        msg.id.startsWith("temp_ai_")
      );

      if (
        tempAiMessages.length > 0 &&
        firebaseMessages.length >
          currentMessages.filter((msg) => !msg.id.startsWith("temp_")).length
      ) {
        console.log(
          "🔄 Replacing temporary AI messages with Firestore messages"
        );
      }

      // Always replace with Firestore messages (this handles temp message cleanup)
      setMessages(selectedConversationId, firebaseMessages);
    });

    return () => unsubscribe();
  }, [selectedConversationId, setMessages]);
}
