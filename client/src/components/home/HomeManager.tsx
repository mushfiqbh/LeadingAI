"use client";

import React, { useEffect, useState, useContext } from "react";
import type { ViewState } from "@/types/types";
import DailyHub from "./DailyHub";
import Chat from "../chat/Chat";
import Header from "../general/Header";
import { Modal } from "../ui/Modal";
import AuthForm from "../auth/AuthForm";
import ContributePage from "../contribute";
import ProfilePage from "./ProfilePage";
import { AuthContext } from "@/context/AuthContext";

interface HomeManagerProps {
  isAnonymous?: boolean;
}

const HomeManager: React.FC<HomeManagerProps> = ({ isAnonymous = false }) => {
  const [view, setView] = useState<ViewState>("home");
  const { isAuthModalOpen, setIsAuthModalOpen } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (view === "chat") {
        event.preventDefault();
        setView("home");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [view]);

  return (
    <div className="relative w-full mt-[40px] overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header onLoginClick={() => setIsAuthModalOpen(true)} />

      <Modal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      >
        <AuthForm />
      </Modal>
      
      {view === "home" && (
        <DailyHub 
          setView={setView}
          onLoginClick={() => setIsAuthModalOpen(true)}
          isAnonymous={isAnonymous}
        />
      )}
      
      {view === "chat" && (
        <Chat />
      )}

      {view === "share" && (
        <ContributePage />
      )}

      {view === "profile" && (
        <ProfilePage />
      )}
    </div>
  );
};

export default HomeManager;
