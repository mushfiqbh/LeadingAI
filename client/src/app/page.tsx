"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { logout } from "@/lib/authFunctions";
import AuthForm from "@/components/auth/AuthForm";
import VerifyEmail from "@/components/auth/VerifyEmail";
import Chat from "@/components/chat/Chat";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Landing from "@/components/general/LandingPage";

export default function Page() {
  const { user, isEmailVerified, loading } = useAuth();
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    if (user && !isEmailVerified && !loading) {
      setShowVerifyEmail(true);
    } else {
      setShowVerifyEmail(false);
    }
  }, [user, isEmailVerified, loading]);

  // If loading
  if (loading) return <LoadingScreen />;

  // If user is not logged in
  if (!user)
    return showLanding ? (
      <Landing setShowLanding={setShowLanding} />
    ) : (
      <AuthForm />
    );

  // If user is logged in but email is not verified
  if (!isEmailVerified && !showVerifyEmail) {
    return (
      <VerifyEmail
        onBack={() => {
          logout();
          setShowVerifyEmail(false);
        }}
      />
    );
  }

  // If user is logged in and email is verified
  return <Chat />;
}
