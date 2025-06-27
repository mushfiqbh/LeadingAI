"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Mail, Lock } from "lucide-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { handleSignIn, handleCreateAccount } from "@/lib/supabaseFunctions";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (isCreatingAccount) {
      const { error } = await handleCreateAccount({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });
      if (error) setError(error);
    } else {
      const { error } = await handleSignIn({
        email: formData.email,
        password: formData.password,
      });
      if (error) setError(error);
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto fixed z-30 top-1/2 left-1/2 -translate-1/2 bg-white text-gray-700 p-6 rounded-2xl shadow-2xl border border-teal-200">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign In Required</h2>

      <div className="space-y-5">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <AiFillGoogleCircle size={18} /> Continue with Google
        </Button>

        <div className="relative my-5">
          <hr className="border-gray-300" />
          <span className="absolute inset-0 flex justify-center -top-3">
            <span className="bg-white px-2 text-sm text-gray-500">or</span>
          </span>
        </div>

        {isCreatingAccount && (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <Lock size={16} />
              Full Name
            </label>
            <Input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Your full name"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
            <Mail size={16} />
            Email
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
            <Lock size={16} />
            Password
          </label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder=""
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          className="w-full mt-2 float-right"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : isCreatingAccount ? (
            "Create Account"
          ) : (
            "Login"
          )}
        </Button>

        <p className="cursor-pointer text-center text-sm text-gray-500 mt-4">
          {isCreatingAccount
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <strong
            onClick={() => {
              setIsCreatingAccount(!isCreatingAccount);
              setFormData({
                email: "",
                password: "",
                fullName: "",
              });
              setError(null);
            }}
            className="text-blue-600 hover:underline"
          >
            {isCreatingAccount ? "Login" : "Create Account"}
          </strong>
        </p>
      </div>
    </div>
  );
}
