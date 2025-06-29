"use client";

import { useAuth } from "@/context/AuthContext";

export default function Page() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Leading AI Agent</h1>
      <p className="text-lg text-gray-600 mb-8">
        Agentic AI platform for leading university students. Collaborate,
        explore, and grow.
      </p>
      <p className="text-lg text-gray-600 mb-8">
        {user ? `Hello, ${user?.displayName}!` : "Please log in to continue."}
      </p>
    </div>
  );
}
