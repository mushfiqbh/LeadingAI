"use client";

import { useAuth } from "@/context/AuthContext";
import { useChatStore } from "@/hooks/useChatStore";
import { useEffect, useRef } from "react";
import { X, MessageCircle, Clock, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/formatFirebaseTimestamp";
import { updateConversationInFirebase } from "@/services/firebaseService";
import { useToaster } from "@/context/ToasterContext";

export default function History() {
  const { user, setShowHistory } = useAuth();
  const { conversations, selectedConversationId, selectConversation } =
    useChatStore();
  const historyRef = useRef<HTMLDivElement>(null);
  const { confirmer } = useToaster();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        historyRef.current &&
        !historyRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [historyRef, setShowHistory]);

  const handleConversationDelete = async (
    e: React.MouseEvent,
    conversationId: string
  ) => {
    e.stopPropagation();
    confirmer(
      "Delete Conversation",
      "Are you sure you want to delete this conversation?",
      async () => {
        updateConversationInFirebase(conversationId, {
          deleted: true,
        });
        selectConversation(
          conversations.find((c) => c.id !== conversationId)?.id || null
        );
      }
    );
  };

  if (!user) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 m-4 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Sign In Required
            </h3>
            <p className="text-gray-500">
              Please log in to view your chat history.
            </p>
            <button
              onClick={() => setShowHistory(false)}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 m-4 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Chat History
            </h3>
            <p className="text-gray-500">
              Start a conversation to see your chat history here.
            </p>
            <button
              onClick={() => setShowHistory(false)}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Chatting
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Sidebar */}
      <div
        ref={historyRef}
        className="w-full max-w-md bg-white shadow-2xl h-full overflow-hidden flex flex-col animate-in slide-in-from-left duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-6 h-6" />
              <h2 className="text-xl font-bold">Chat History</h2>
            </div>
            <p className="text-blue-100 mt-2 text-sm">
              {conversations.length} conversation
              {conversations.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setShowHistory(false)}
            className="p-6 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close history"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {conversations.map((conversation, index) => (
              <div
                key={conversation.id}
                onClick={() => {
                  selectConversation(conversation.id);
                  setShowHistory(false);
                }}
                className={`group relative p-4 m-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-md border border-transparent hover:border-gray-200 ${
                  selectedConversationId === conversation.id
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {conversation.title}
                    </h3>

                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {conversation.lastMessage
                        ? conversation.lastMessage.text
                        : "No messages yet"}
                    </p>

                    <div className="flex items-center mt-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>
                        {conversation.updatedAt
                          ? formatDate(conversation.updatedAt)
                          : "Recently"}
                      </span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  {conversations.length > 1 && (
                    <div className="transition-opacity">
                      <button
                        onClick={(e) =>
                          handleConversationDelete(e, conversation.id)
                        }
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Delete conversation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Active Indicator */}
                <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Your conversations are automatically saved
          </p>
        </div>
      </div>
    </div>
  );
}
