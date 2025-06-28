"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { signInWithGoogle, signInWithEmail } from "@/lib/authFunctions";
import { firebaseAuthError } from "@/lib/firebaseAuthError";

export default function LoginForm({
  onSwitch,
  onResetPassword,
}: {
  onSwitch: () => void;
  onResetPassword: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await signInWithEmail(email, password);

      if (error) {
        setError(firebaseAuthError(error));
      }
    } catch (err) {
      // catches unexpected throws
      let message = "An unexpected error occurred.";
      if (typeof err === "object" && err && "code" in err) {
        message = (err as { code: string }).code;
      }
      setError(message);
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        // Only show error if it's not a popup closed error
        if (error.message !== 'Sign in was cancelled. Please try again.') {
          setError(error.message);
        }
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Button
        type="button"
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
            <Mail size={16} /> Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center justify-between gap-2 text-gray-700">
            <div className="flex items-center gap-2">
              <Lock size={16} /> Password
            </div>
            <button
              type="button"
              onClick={onResetPassword}
              className="text-xs text-blue-600 hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </label>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Login"}
        </Button>
      </form>

      <p className="cursor-pointer text-center text-sm text-gray-500 mt-4">
        Don`t have an account?{" "}
        <strong onClick={onSwitch} className="text-blue-600 hover:underline">
          Create Account
        </strong>
      </p>
    </div>
  );
}
