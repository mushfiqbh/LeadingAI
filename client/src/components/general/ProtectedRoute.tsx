"use client";

import React from "react";
import { useContext } from "react";
import { AuthContext, useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/ui/LoadingScreen";

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const { user, loading } = useAuth();
  const { setIsAuthModalOpen } = useContext(AuthContext);

  if (loading) return <LoadingScreen />;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-150px)]">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4">You must be logged in to view this page.</p>
        <button onClick={() => setIsAuthModalOpen(true)} className="text-blue-500 hover:underline cursor-pointer">
          Please Login
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
