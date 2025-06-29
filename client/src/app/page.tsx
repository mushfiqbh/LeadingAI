"use client";

import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { logout } from "@/lib/authFunctions";
import AuthForm from "@/components/auth/AuthForm";
import VerifyEmail from "@/components/auth/VerifyEmail";
import Chat from "@/components/chat/Chat";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function Page() {
  const { user, isEmailVerified, loading } = useAuth();
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);

  useEffect(() => {
    if (user && !isEmailVerified && !loading) {
      setShowVerifyEmail(true);
    } else {
      setShowVerifyEmail(false);
    }
  }, [user, isEmailVerified, loading]);

  if (loading) return <LoadingScreen />;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <AuthForm />
      </div>
    );
  }

  if (!isEmailVerified && !showVerifyEmail) {
    return (
      <div className="flex items-center justify-center h-full">
        <VerifyEmail
          onBack={() => {
            logout();
            setShowVerifyEmail(false);
          }}
        />
      </div>
    );
  }

  return <Chat />;
}
