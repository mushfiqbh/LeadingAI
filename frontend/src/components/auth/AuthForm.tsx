"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "./LoginForm";
import CreateAccountForm from "./CreateAccountForm";
import ResetPasswordForm from "./ResetPasswordForm";

export default function AuthForm() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { user, isEmailVerified, setIsAuthModalOpen } = useAuth();

  // Close modal if user is logged in and verified
  useEffect(() => {
    if (user && isEmailVerified) {
      setIsAuthModalOpen(false);
    }
  }, [user, isEmailVerified, setIsAuthModalOpen]);

  // If user is logged in (verified or not), don't show login forms
  if (user) {
    return null;
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-transparent text-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        {isCreatingAccount
          ? "Create Account"
          : isResettingPassword
          ? "Reset Password"
          : "Sign In"}
      </h2>

      {isCreatingAccount ? (
        <CreateAccountForm onSwitch={() => setIsCreatingAccount(false)} />
      ) : isResettingPassword ? (
        <ResetPasswordForm onBack={() => setIsResettingPassword(false)} />
      ) : (
        <LoginForm
          onSwitch={() => setIsCreatingAccount(true)}
          onResetPassword={() => setIsResettingPassword(true)}
        />
      )}
    </div>
  );
}
