"use client";

import { AuthContext, useAuth } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import AuthForm from "@/components/auth/AuthForm";
import Chat from "@/components/chat/Chat";

export default function Page() {
  const { user, isEmailVerified, loading } = useAuth();
  const { isAuthModalOpen, setIsAuthModalOpen } = useContext(AuthContext);

  useEffect(() => {
    fetch(
      "https://leadingai-fcfebbhfhfeybbej.centralindia-01.azurewebsites.net",
    );
  }, [user, isEmailVerified, loading]);

  // If user is logged in and email is verified
  return (
    <main className="w-full bg-white text-black/80">      
      <Chat />
      
      <Modal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      >
        <AuthForm />
      </Modal>
    </main>
  );
}
