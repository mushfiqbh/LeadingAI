"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfileFS } from "@/lib/firestore";

export default function TokenManager({
  setShowManager,
}: {
  setShowManager: (value: boolean) => void;
}) {
  const { user, userProfile, setUserProfile } = useAuth();
  const [newTokens, setNewTokens] = useState<number>(0);
  const managerRef = useRef<HTMLDivElement>(null);

  const addTokens = async () => {
    if (user && userProfile) {
      const newProfile = await updateUserProfileFS(user, {
        tokens: userProfile?.tokens + newTokens,
      });
      setUserProfile(newProfile);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        managerRef.current &&
        !managerRef.current.contains(event.target as Node)
      ) {
        setShowManager(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowManager]);

  return (
    <div
      ref={managerRef}
      className="fixed inset-0 top-72 flex items-center justify-center bg-gradient-to-br from-blue-100/60 via-purple-100/60 to-pink-100/60 backdrop-blur-sm z-50"
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl border border-blue-200 dark:border-blue-900 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xl font-bold"
          onClick={() => setShowManager(false)}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-center drop-shadow-lg">
          Token Management
        </h2>
        <div className="mb-8 text-center">
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Current Token Balance:
          </span>
          <span className="ml-2 text-3xl font-extrabold text-green-600 dark:text-green-400 drop-shadow">
            {Number(userProfile?.tokens) - Number(userProfile?.usedTokens)}
          </span>
        </div>
        <div className="mb-6">
          <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
            Add Tokens
          </label>
          <div className="flex gap-2">
            {[
              {
                value: 10,
                label: "10",
                color: "bg-slate-400",
              },
              {
                value: 1000,
                label: "1000",
                color: "bg-slate-400",
              },
              {
                value: 2000,
                label: "2000",
                color: "bg-slate-400",
              },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setNewTokens(opt.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow-sm transition-all duration-200 text-sm
                ${
                  newTokens === opt.value
                    ? `${opt.color} text-white border-blue-500 scale-105`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                aria-pressed={newTokens === opt.value}
              >
                {newTokens === opt.value && (
                  <span className="inline-block w-2 h-2 rounded-full bg-white mr-2"></span>
                )}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center">
          <button
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-lg"
            onClick={addTokens}
          >
            Add The Token
          </button>
        </div>
      </div>
    </div>
  );
}
