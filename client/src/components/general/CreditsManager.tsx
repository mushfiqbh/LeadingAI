"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfileFS } from "@/lib/firestore";

export default function CreditsManager({
  setShowManager,
}: {
  setShowManager: (value: boolean) => void;
}) {
  const { user, userProfile, setUserProfile } = useAuth();
  const [newCredits, setNewCredits] = useState<number>(0);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const managerRef = useRef<HTMLDivElement>(null);

  const addCredits = async () => {
    if (user && userProfile) {
      const newProfile = await updateUserProfileFS(user, {
        credits: userProfile?.credits + newCredits,
      });
      setUserProfile(newProfile);
    }
  };

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
    <div className="w-full min-h-[100vh] fixed left-0 top-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4 py-8">
      <div
        ref={managerRef}
        className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors text-lg font-bold w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          onClick={() => setShowManager(false)}
          aria-label="Close"
        >
          X
        </button>

        {/* Credits Balance */}
        <div className="mb-6 flex items-center justify-start space-x-4">
          <p className="text-xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-center">
            Credits Balance
          </p>
          <span className="text-2xl md:text-3xl font-bold text-green-500 dark:text-green-400">
            {Number(userProfile?.credits) - Number(userProfile?.usedCredits)}
          </span>
        </div>

        {/* Free Credits Promotion */}
        <div className="mb-6 bg-gradient-to-r from-yellow-50 via-pink-50 to-purple-50 dark:from-yellow-900/20 dark:via-pink-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-lg font-semibold mb-2 text-pink-600 dark:text-pink-400">
            🎁 Get 32,000 Credits FREE
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Sign up to OpenRouter and claim your free credits!
          </p>
          <a
            href="https://openrouter.ai/signup"
            target="_blank"
            className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-lg shadow hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Claim Now
          </a>
        </div>

        {/* Premium Credits Packages */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            💎 Premium Packages
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { credits: 100, price: 10 },
              { credits: 500, price: 50 },
              { credits: 1000, price: 99 },
            ].map((pkg) => (
              <label
                key={pkg.credits}
                className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPackage === pkg.credits
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md"
                    : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm"
                }`}
              >
                <input
                  type="radio"
                  name="creditPackage"
                  checked={selectedPackage === pkg.credits}
                  onChange={() => setSelectedPackage(pkg.credits)}
                  className="w-4 h-4 text-blue-600 mb-2 sr-only"
                />
                <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm text-center">
                  {pkg.credits.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Credits
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {pkg.price}
                  <span className="text-xs"> BDT</span>
                </span>
              </label>
            ))}
          </div>
          <button
            disabled={selectedPackage === null}
            className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-base shadow hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              if (selectedPackage) {
                setNewCredits(selectedPackage);
                addCredits(); // or trigger actual purchase process
              }
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
