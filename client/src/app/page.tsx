"use client";

import { AuthContext, useAuth } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { logout } from "@/lib/authFunctions";
import VerifyEmail from "@/components/auth/VerifyEmail";
import DailyHub from "@/components/home/DailyHub";
import Header from "@/components/general/Header";
import { Modal } from "@/components/ui/Modal";
import AuthForm from "@/components/auth/AuthForm";

export default function Page() {
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const { user, isEmailVerified, loading } = useAuth();
  const { isAuthModalOpen, setIsAuthModalOpen } = useContext(AuthContext);

  useEffect(() => {
    fetch(
      "https://leadingai-fcfebbhfhfeybbej.centralindia-01.azurewebsites.net",
    );

    if (user && !isEmailVerified && !loading) {
      setShowVerifyEmail(true);
    } else {
      setShowVerifyEmail(false);
    }
  }, [user, isEmailVerified, loading]);

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
  return (
    <main className="w-full bg-white text-black/80 mt-[40px]">
      <Header />
      <DailyHub />
      
      <Modal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      >
        <AuthForm />
      </Modal>
    </main>
  );
}
