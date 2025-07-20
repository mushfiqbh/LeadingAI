"use client";

import { useAuth } from "@/context/AuthContext";
import { useToaster } from "@/context/ToasterContext";
import { logout } from "@/lib/authFunctions";
import { Bot, Check, CircleUser, MessageSquareDiff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/hooks/useChatStore";
import CreditsManager from "./CreditsManager";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, userProfile, loading, showManager, setShowManager } = useAuth();
  const router = useRouter();
  const { createConversationInFirebase, selectConversation } = useChatStore();
  const { prompt } = useToaster();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNewConversation = async () => {
    if (!user?.uid || isCreatingConversation) return;

    setShowMenu(false);

    // Use toaster prompt to get conversation title
    prompt(
      "New Conversation",
      "Enter a title for your new conversation:",
      async (title: string) => {
        if (!title.trim()) return;

        setIsCreatingConversation(true);

        try {
          const newConversationData = {
            title: title.trim(),
            participants: [user.uid],
            lastMessage: null,
          };

          const conversationId = await createConversationInFirebase(
            newConversationData
          );

          // Select the new conversation
          selectConversation(conversationId);

          // Navigate to chat page if not already there
          if (window.location.pathname !== "/") {
            router.push("/");
          }
        } catch (error) {
          console.error("❌ Error creating new conversation:", error);
          // You might want to show a toast notification here
        } finally {
          setIsCreatingConversation(false);
        }
      },
      {
        inputPlaceholder: "e.g., Math Help, Study Session, etc.",
        buttonText: "Create",
      }
    );
  };

  return (
    <div className="w-full min-h-[70px] fixed top-0 z-20 bg-white backdrop-blur-md shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Leading AI
              </h1>

              {loading ? (
                <p className="text-xs text-gray-500 animate-pulse">
                  Loading...
                </p>
              ) : (
                user && (
                  <p
                    onClick={() => setShowManager(true)}
                    className="text-xs text-gray-500"
                  >
                    <span className="text-blue-600 font-semibold">
                      {Number(userProfile?.totalCredits) -
                        Number(userProfile?.usedCredits)}
                    </span>{" "}
                    Credits Remaining
                  </p>
                )
              )}
            </div>
          </Link>

          {user && (
            <div className="flex items-center gap-2">
              <button
                name="contribute"
                onClick={() => {
                  if (!user.emailVerified) {
                    alert("Please verify your email to contribute.");
                    return;
                  }
                  router.push("/contribute");
                }}
                className="px-2 py-1 text-xs md:text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                Contribute
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all duration-200 hover:scale-105 ring-2 ring-transparent hover:ring-blue-500/20"
                >
                  {user.photoURL ? (
                    <Image
                      height={32}
                      width={32}
                      src={user.photoURL}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  ) : (
                    <CircleUser className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {showManager && <CreditsManager />}

                {showMenu && (
                  <div
                    ref={menuRef}
                    onClick={() => setShowMenu(false)}
                    className="absolute top-12 right-0 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-sm z-40 overflow-hidden"
                  >
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200/50">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-gray-800 font-semibold">
                              {user.displayName || "Anonymous"}
                            </strong>
                            {user.emailVerified && (
                              <span className="text-green-500">
                                <Check className="w-4 h-4" />
                              </span>
                            )}
                          </div>
                          <div className="w-full pr-1 text-xs text-gray-600 truncate">
                            {user.email || "No email provided"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors duration-200 text-gray-700 hover:text-gray-900"
                      >
                        <CircleUser className="w-4 h-4" />
                        <span className="font-medium">Profile</span>
                      </Link>

                      <button
                        onClick={() => setShowManager(true)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors duration-200 text-green-600 hover:text-green-700"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span className="font-medium">Credits</span>
                      </button>

                      {window.location.pathname !== "/" ? (
                        <Link
                          href="/"
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors duration-200 text-gray-700 hover:text-gray-900"
                        >
                          <MessageSquareDiff className="w-4 h-4" />
                          <span className="font-medium">Back to Chat</span>
                        </Link>
                      ) : (
                        <button
                          onClick={handleNewConversation}
                          className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors duration-200 text-gray-700 hover:text-gray-900"
                        >
                          <MessageSquareDiff className="w-4 h-4" />
                          <span className="font-medium">New Chat</span>
                        </button>
                      )}

                      <Link
                        href="/history"
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors duration-200 text-gray-700 hover:text-gray-900"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium">History</span>
                      </Link>

                      <Link
                        href="/report"
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors duration-200 text-gray-700 hover:text-gray-900"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        <span className="font-medium">Report / Feedback</span>
                      </Link>

                      <Link
                        href="/developer"
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors duration-200 text-gray-700 hover:text-gray-900"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                        <span className="font-medium">Developer</span>
                      </Link>
                    </div>

                    <div className="border-t border-gray-200/50 p-2">
                      <button
                        onClick={() => {
                          logout();
                          router.push("/");
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-3 p-2 text-red-500 hover:bg-red-50 transition-colors duration-200 rounded-xl"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
