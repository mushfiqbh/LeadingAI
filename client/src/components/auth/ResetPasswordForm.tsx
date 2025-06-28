"use client";

import { FormEvent, useState } from "react";
import { resetPassword } from "@/lib/authFunctions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ResetPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await resetPassword(email);
    if (error) {
      setMessage("Failed to send reset email. Please try again.");
    } else {
      setMessage("Password reset email sent! Check your inbox.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Email address</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {message && <p className="text-sm text-gray-600">{message}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending..." : "Send Reset Email"}
      </Button>

      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer text-sm text-blue-600 hover:underline mt-2 block"
      >
        Back to Login
      </button>
    </form>
  );
}
