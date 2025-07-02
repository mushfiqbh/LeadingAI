"use client";

import { useEffect, useCallback, useRef } from "react";
import { useChatStore } from "@/hooks/useChatStore";
import { useAuth } from "@/context/AuthContext";

export const useChatSession = () => {
  const { user } = useAuth();
  const {
    conversations,
    selectedConversationId,
    selectConversation,
    createConversationInFirebase,
    areConversationsLoading,
  } = useChatStore();

  const sessionInitializedRef = useRef(false);
  const initializationAttemptedRef = useRef(false);

  const initializeUserSession = useCallback(async () => {
    // Skip if already initialized, no user, or conversations are still loading
    if (
      !user?.uid ||
      sessionInitializedRef.current ||
      areConversationsLoading
    ) {
      return;
    }

    // Mark that we've attempted initialization
    initializationAttemptedRef.current = true;

    try {
      // Check if user already has a conversation
      const userConversation = conversations.find((conv) =>
        conv.participants.includes(user.uid)
      );

      if (userConversation) {
        // User has existing conversation - select it
        if (selectedConversationId !== userConversation.id) {
          selectConversation(userConversation.id);
        }
      } else {
        // User has no conversation - create one
        const newConversationData = {
          participants: [user.uid],
          lastMessage: null,
          title: "New Chat",
        };

        const conversationId = await createConversationInFirebase(
          newConversationData
        );
        selectConversation(conversationId);
      }

      sessionInitializedRef.current = true;
    } catch (error) {
      console.error("❌ Error initializing chat session:", error);
    }
  }, [
    user?.uid,
    conversations,
    selectedConversationId,
    selectConversation,
    createConversationInFirebase,
    areConversationsLoading,
  ]);

  // Initialize session when user is loaded and conversations are available
  useEffect(() => {
    if (user?.uid && !areConversationsLoading) {
      // Only attempt initialization if we haven't already tried or succeeded
      if (
        !initializationAttemptedRef.current &&
        !sessionInitializedRef.current
      ) {
        initializeUserSession();
      }
    }
  }, [user?.uid, areConversationsLoading, initializeUserSession]);

  // Reset session when user logs out
  useEffect(() => {
    if (!user) {
      sessionInitializedRef.current = false;
      initializationAttemptedRef.current = false;
    }
  }, [user]);

  return {
    isSessionReady: sessionInitializedRef.current,
    selectedConversationId,
    isLoading: !sessionInitializedRef.current,
  };
};
