"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { logout } from "@/lib/authFunctions";
import VerifyEmail from "@/components/auth/VerifyEmail";
import LoadingScreen from "@/components/ui/LoadingScreen";
import HomeManager from "@/components/home/HomeManager";

export default function Page() {
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const { user, isEmailVerified, loading } = useAuth();

  useEffect(() => {
    fetch(
      "https://leadingai-fcfebbhfhfeybbej.centralindia-01.azurewebsites.net"
    );

    if (user && !isEmailVerified && !loading) {
      setShowVerifyEmail(true);
    } else {
      setShowVerifyEmail(false);
    }
  }, [user, isEmailVerified, loading]);

  // If loading
  if (loading) return <LoadingScreen />;

  // If user is not logged in
  if (!user) {
    return (
      <>
        <HomeManager isAnonymous={true} />
      </>
    );
  }

  // If user is logged in but email is not verified
  if (!isEmailVerified && showVerifyEmail) {
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
  return <HomeManager />;
}
