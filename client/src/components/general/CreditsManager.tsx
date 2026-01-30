"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function CreditsManager() {
  const { userProfile, setShowManager } = useAuth();
  const managerRef = useRef<HTMLDivElement>(null);
  const CREDITS_BALANCE =
    Number(userProfile?.totalCredits || 0) -
    Number(userProfile?.usedCredits || 0);

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
    <div className="w-full min-h-[100vh] fixed left-0 top-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50 px-4 py-8">
      <motion.div
        ref={managerRef}
        className="w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/20 relative max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-end">
          <motion.button
            className="text-gray-400 hover:text-red-500 transition-all duration-200 w-10 h-10 flex items-center justify-center hover:bg-red-50 rounded-full group"
            onClick={() => setShowManager(false)}
            aria-label="Close"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-xl font-light group-hover:rotate-90 transition-transform duration-200">
              X
            </span>
          </motion.button>
        </div>

        {/* Credits Balance */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {CREDITS_BALANCE > 0
                  ? `Credits Balance: ${CREDITS_BALANCE}`
                  : "No Credits Available"}
              </h3>
              <p className="text-xs text-gray-500">
                {CREDITS_BALANCE > 0
                  ? "You can use these credits for AI interactions."
                  : "Please purchase credits to continue."}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                {CREDITS_BALANCE}
              </div>
              <p className="text-xs text-gray-500">remaining</p>
            </div>
          </div>

          {/* Credits Progress Bar */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-red-600">
                Used: {userProfile?.usedCredits || 0}
              </span>
              <span className="text-blue-600">
                Total: {userProfile?.totalCredits || 0}
              </span>
            </div>

            <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-full relative"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(
                    (Number(userProfile?.usedCredits || 0) /
                      Number(userProfile?.totalCredits || 1)) *
                      100,
                    100
                  )}%`,
                }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                  delay: 0.6,
                }}
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.5,
                    delay: 2.5,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-300/40 via-blue-400/40 to-purple-500/40 rounded-full blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Free Credits Promotion */}
        <motion.div
          className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4 rounded-3xl border border-orange-200/50 shadow-lg relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-200/30 to-orange-300/30 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-pink-200/30 to-purple-300/30 rounded-full translate-y-4 -translate-x-4"></div>

          <div className="relative z-10">
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              <div className="text-3xl">🎁</div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  Get 3200 Credits FREE
                </h3>
              </div>
            </motion.div>

            <motion.p
              className="text-sm text-gray-700 mb-4 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              Sign up to OpenRouter and claim your free credits to power your AI
              conversations!
            </motion.p>

            <motion.a
              href="https://openrouter.ai/signup"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Claim Now</span>
              <motion.span
                className="text-lg"
                animate={{ x: [0, 3, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                →
              </motion.span>
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
