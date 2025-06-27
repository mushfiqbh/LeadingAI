"use client";

import { CircleUser } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="fixed top-0 w-full z-10 bg-transparent p-4">
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
        <div className="ml-auto">
          <CircleUser
            onClick={() => setShowMenu(!showMenu)}
            className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700"
          />
          {showMenu && (
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
                    <strong>Mushfiq R.</strong>
                    <div className="text-sm text-gray-500">
                      Remaining Prompt: 50
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // Handle buy click
                    }}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    Buy Prompt Credits
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
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                  >
                    Report / Feedback
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // Handle logout click
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
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
