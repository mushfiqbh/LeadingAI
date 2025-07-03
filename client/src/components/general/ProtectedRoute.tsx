"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/ui/LoadingScreen";

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-150px)]">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4">You must be logged in to view this page.</p>
        <Link href="/" className="text-blue-500 hover:underline cursor-pointer">
          Go to Login
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
