"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { Modal } from "@/components/ui/Modal";
import AuthForm from "@/components/auth/AuthForm";
import Chat from "@/components/chat/Chat";

export default function Page() {
  const { isAuthModalOpen, setIsAuthModalOpen } = useContext(AuthContext);

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
