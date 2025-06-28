"use client";

import { Chat } from "@/components/chat/Chat";
import AuthForm from "@/components/auth/AuthForm";
import VerifyEmail from "@/components/auth/VerifyEmail";
import Header from "@/components/ui/Header";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { logout } from "@/lib/authFunctions";

export default function Home() {
  const { user, isEmailVerified, loading } = useAuth();
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  

  useEffect(() => {
    if (user && !isEmailVerified && !loading) {
      setShowVerifyEmail(true);
    } else {
      setShowVerifyEmail(false);
    }
  }, [user, isEmailVerified, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 mt-[80px] flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 mt-[80px]">
        {user && isEmailVerified ? (
          <Chat />
        ) : showVerifyEmail ? (
          <div className="flex items-center justify-center h-full">
            <VerifyEmail
              onBack={() => {
                logout();
                setShowVerifyEmail(false);
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <AuthForm />
          </div>
        )}
      </main>
    </div>
  );
}
