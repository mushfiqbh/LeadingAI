"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";
import { sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/Button";
import { Loader2, MailCheck, ArrowLeft } from "lucide-react";

export default function VerifyEmail({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [isChecking, setIsChecking] = useState(true);

  // Check auth state and set email
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || "");
        // Send verification email if not already verified
        if (!user.emailVerified) {
          handleResend();
        }
      } else {
        setError("No user is logged in. Please sign in again.");
      }
      setIsChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // Poll every 5s to check if email is verified
  useEffect(() => {
    if (isChecking) return;

    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          await user.reload();
          if (user.emailVerified) {
            clearInterval(interval);
            router.push("/");
          }
        } catch (err) {
          console.error("Error checking verification status:", err);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [router, isChecking]);

  const handleResend = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user, {
          url: `${window.location.origin}/dashboard`,
        });
        setMessage("Verification email sent! Please check your inbox.");
      } else {
        setError("No user is logged in. Please sign in again.");
      }
    } catch (err) {
      console.error("Error sending verification email:", err);
      setError("Failed to send verification email. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center p-6 max-w-md mx-auto">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <MailCheck className="mx-auto text-blue-600 mb-3" size={48} />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Verify your email
        </h2>
        <p className="text-gray-600 mb-4">
          We`ve sent a verification link to{" "}
          <span className="font-semibold">{email}</span>. Please check your
          inbox and click the link to verify your email address.
        </p>
        <p className="text-sm text-gray-500">
          Didn`t receive the email? Check your spam folder or resend the
          verification email.
        </p>
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <Button
          onClick={handleResend}
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Sending...
            </>
          ) : (
            "Resend Verification Email"
          )}
        </Button>

        <Button
          variant="ghost"
          onClick={onBack}
          className="text-blue-600 hover:bg-blue-50 w-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Button>
      </div>
    </div>
  );
}
