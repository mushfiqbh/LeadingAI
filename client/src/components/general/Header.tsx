"use client";

import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/authFunctions";
import { Check, CircleUser } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CreditsManager from "./CreditsManager";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    user,
    userProfile,
    loading,
    showManager,
    setShowManager,
  } = useAuth();
  const router = useRouter();

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

  return (
    <div className="w-full min-h-[40px] fixed top-0 z-20 bg-white backdrop-blur-md shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              LeadingAI
            </h1>
          </Link>

          {user && (
            <div className="flex items-center gap-5">
              {loading ? (
                <p className="text-xs text-gray-500 animate-pulse">
                  Loading...
                </p>
              ) : (
                user && (
                  <button
                    onClick={() => setShowManager(true)}
                    className="text-sm text-gray-500 cursor-pointer"
                  >
                    <span className="text-blue-500 font-semibold">
                      {Number(userProfile?.totalCredits) -
                        Number(userProfile?.usedCredits)}
                    </span>{" "}
                    AI Credits
                  </button>
                )
              )}

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

                      {window.location.pathname !== "/" && (
                        <Link
                          href="/"
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
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                          <span className="font-medium">Home</span>
                        </Link>
                      )}

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
