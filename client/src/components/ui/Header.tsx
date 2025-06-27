"use client";

import { useAuth } from "@/context/authContext";
import { handleSignOut } from "@/lib/supabaseFunctions";
import { CircleUser } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const { user, session } = useAuth();

  return (
    <div className="fixed top-0 w-full z-10 p-4 bg-transparent backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">AI</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Lucid AI Agent
          </h1>
          <p className="text-sm text-gray-500">Powered by GPT-4.1 Nano</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {session ? (
            <div
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300"
            >
              {user?.user_metadata?.avatar_url ? (
                <Image
                  height={30}
                  width={30}
                  src={user.user_metadata.avatar_url}
                  alt="User Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <CircleUser className="w-4 h-4 text-gray-500" />
              )}
            </div>
          ) : (
            <CircleUser
              onClick={() => setShowMenu(!showMenu)}
              className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700"
            />
          )}

          {showMenu && session && (
            <div className="fixed z-20 top-16 right-4 rounded-lg shadow-lg border border-gray-300">
              <ul className="text-gray-700 bg-white rounded-lg shadow-lg">
                <li>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // Handle profile click
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    <strong>
                      {user?.user_metadata?.full_name || user?.email || "User"}
                    </strong>
                    <div className="text-sm text-gray-500">
                      {user?.email || "No email provided"}
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // Handle buy click
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    Buy Prompt Credit
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // Handle data click
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    My Data
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // Handle settings click
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    Settings
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // Handle report click
                    }}
                    className="w-full text-left px-4 py-2 text-green-400 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    Contribute
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // Handle report click
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    Report / Feedback
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // Handle report click
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    Developer
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleSignOut();
                    }}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
