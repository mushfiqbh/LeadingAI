"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signUpWithEmail } from "@/lib/authFunctions";
import { firebaseAuthError } from "@/lib/firebaseAuthError";

export default function CreateAccountForm({
  onSwitch,
}: {
  onSwitch: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!fullName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error } = await signUpWithEmail(email, password, fullName);

      localStorage.setItem("emailVerificationLastSent", Date.now().toString());

      if (error) {
        setError(firebaseAuthError(error));
      } else {
        // Clear the form
        setFullName("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error("Signup error:", err);
      let message = "An unexpected error occurred.";
      if (typeof err === "object" && err && "code" in err) {
        message = (err as { code: string }).code;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2 text-gray-400">
          <Lock size={16} /> Full Name
        </label>
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
        />
      </div>

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
        <label className="text-sm font-medium flex items-center gap-2 text-gray-400">
          <Lock size={16} /> Password
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
      {successMessage && (
        <p className="text-green-400 text-xs bg-green-400/10 p-2 rounded-lg">{successMessage}</p>
      )}

      <Button type="submit" className="w-full mt-4 bg-white text-black hover:bg-gray-200" disabled={loading}>
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          "Create Account"
        )}
      </Button>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <strong onClick={onSwitch} className="text-blue-500 hover:text-blue-400 transition-colors cursor-pointer">
          Login
        </strong>
      </p>
    </form>
  );
}
