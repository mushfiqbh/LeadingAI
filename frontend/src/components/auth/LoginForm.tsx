"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
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

    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

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
        if (error.message !== "Sign in was cancelled. Please try again.") {
          setError(error.message);
        }
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2 text-gray-200 border-white/10 hover:bg-white/5"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="24"
          height="24"
          viewBox="0 0 48 48"
        >
          <path
            fill="#fbc02d"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
          <path
            fill="#e53935"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          ></path>
          <path
            fill="#4caf50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          ></path>
          <path
            fill="#1565c0"
            d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
        </svg>{" "}
        Continue with Google
      </Button>

      <div className="relative my-6">
        <hr className="border-white/10" />
        <span className="absolute inset-0 flex justify-center -top-3">
          <span className="bg-[#0f0f0f] px-2 text-sm text-gray-500">or</span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2 text-gray-400">
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
          <label className="text-sm font-medium flex items-center justify-between gap-2 text-gray-400">
            <div className="flex items-center gap-2">
              <Lock size={16} /> Password
            </div>
            <button
              type="button"
              onClick={onResetPassword}
              className="text-xs text-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
            >
              Forgot Password?
            </button>
          </label>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 text-xs bg-red-400/10 p-2 rounded-lg">{error}</p>}

        <Button type="submit" className="w-full mt-4 bg-white text-black hover:bg-gray-200" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Login"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don`t have an account?{" "}
        <strong onClick={onSwitch} className="text-blue-500 hover:text-blue-400 transition-colors cursor-pointer">
          Create Account
        </strong>
      </p>
    </div>
  );
}
