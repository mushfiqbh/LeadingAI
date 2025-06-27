"use client";

import { Chat } from "@/components/Chat";
import LoginForm from "@/components/LoginForm";
import Header from "@/components/ui/Header";
import { useAuth } from "@/context/authContext";
import { useEffect } from "react";

export default function Home() {
  const { user, session, loading } = useAuth();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 mt-[80px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : user || session ? (
          <Chat />
        ) : (
          <div className="flex items-center justify-center h-full">
            <LoginForm />
          </div>
        )}
      </main>
    </div>
  );
}
