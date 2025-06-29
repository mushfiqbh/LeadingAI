"use client";

import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/authFunctions";
import { Check, CircleUser, HistoryIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

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
    <div className="fixed top-0 w-full z-10 p-4 bg-white">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Leading AI Agent
            </h1>
            <p className="text-sm text-gray-500">Powered by GPT-4.1 Nano</p>
          </div>
        </Link>

        {user && (
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => {
                setShowMenu(false);
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300"
            >
              <HistoryIcon className="w-6 h-6 text-black/50" />
            </button>

            <div
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300"
            >
              {user.photoURL ? (
                <Image
                  height={30}
                  width={30}
                  src={user.photoURL}
                  alt="User Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <CircleUser className="w-4 h-4 text-gray-500" />
              )}
            </div>

            {user && showMenu && (
              <div
                ref={menuRef}
                onClick={() => setShowMenu(false)}
                className="fixed z-20 top-16 right-4 rounded-lg shadow-lg border border-gray-300"
              >
                <div className="flex flex-col items-center text-gray-700 bg-white rounded-lg shadow-lg">
                  <Link
                    href="/profile"
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    <div className="flex items-center gap-2">
                      <strong>{user.displayName || "Anonymous"}</strong>
                      {user.emailVerified && (
                        <span className="text-green-500 text-xs">
                          <Check className="inline w-4 h-4" />
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.email || "No email provided"}
                    </div>
                  </Link>
                  <Link
                    href="/profile"
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    My Data
                  </Link>
                  <Link
                    href="/history"
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    History
                  </Link>
                  <Link
                    href="/contribute"
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer rounded text-green-400"
                  >
                    Contribute
                  </Link>
                  <Link
                    href="/report"
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    Report / Feedback
                  </Link>
                  <Link
                    href="/developer"
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    Developer
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
