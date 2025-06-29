"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "./LoginForm";
import CreateAccountForm from "./CreateAccountForm";
import ResetPasswordForm from "./ResetPasswordForm";

export default function AuthForm() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { user, isEmailVerified } = useAuth();

  // If user is logged in but not verified
  if (user && !isEmailVerified) {
    return null;
  }

  return (
    <div className="w-full max-w-sm mx-auto fixed z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-gray-700 p-6 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isCreatingAccount
          ? "Create Account"
          : isResettingPassword
          ? "Reset Password"
          : "Sign In Required"}
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
