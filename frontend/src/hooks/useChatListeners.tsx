import { useEffect } from "react";
import { db } from "@/lib/firebaseClient";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  limitToLast,
} from "firebase/firestore";
import { useChatStore } from "./useChatStore";
import { Conversation, Message } from "@/types/types";

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

        setConversations(
          convos.filter((c): c is Conversation => c.deleted !== true)
        );
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
      orderBy("timestamp", "asc"),
      limitToLast(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firebaseMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as Message[];

      setMessages(selectedConversationId, firebaseMessages);
    });

    return () => unsubscribe();
  }, [selectedConversationId, setMessages]);
}
