"use client";

import { useState, useEffect, useCallback } from "react";
import { auth } from "@/lib/firebaseClient";
import { sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/Button";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";

export default function VerifyEmail({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [isChecking, setIsChecking] = useState(true);
  const [cooldownTime, setCooldownTime] = useState<number>(0);

  // Manual verification check function
  const checkVerificationStatus = useCallback(async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          localStorage.removeItem("emailVerificationLastSent");
          window.location.reload();
        } else {
          setError("Email is still not verified. Please check your inbox.");
        }
      }
    } catch (err) {
      console.error("Error checking verification status:", err);
      setError("Failed to check verification status. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Check cooldown from localStorage on component mount and set initial state
  useEffect(() => {
    const lastSentTime = localStorage.getItem("emailVerificationLastSent");
    if (lastSentTime) {
      const timeDiff = Date.now() - parseInt(lastSentTime);
      const remainingTime = Math.max(0, Math.ceil((60000 - timeDiff) / 1000)); // 60 seconds cooldown
      setCooldownTime(remainingTime);
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            // Clear the cooldown from localStorage when it expires
            localStorage.removeItem("emailVerificationLastSent");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  const handleResend = useCallback(async () => {
    // Check if still in cooldown
    const lastSentTime = localStorage.getItem("emailVerificationLastSent");
    if (lastSentTime) {
      const timeDiff = Date.now() - parseInt(lastSentTime);
      if (timeDiff < 60000) {
        // 60 seconds cooldown
        const remainingTime = Math.ceil((60000 - timeDiff) / 1000);
        setCooldownTime(remainingTime);
        setError(`Please wait ${remainingTime} seconds before resending.`);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user, {
          url: `${window.location.origin}/`,
        });

        // Set cooldown in localStorage
        localStorage.setItem(
          "emailVerificationLastSent",
          Date.now().toString()
        );
        setCooldownTime(60); // 60 seconds cooldown
      } else {
        setError("No user is logged in. Please sign in again.");
      }
    } catch (err) {
      console.error("Error sending verification email:", err);
      setError("Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth state and set email
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || "");
        if (user.emailVerified) {
          // Email is verified, clean up localStorage
          localStorage.removeItem("emailVerificationLastSent");
        }
      } else {
        // User logged out, clean up localStorage
        localStorage.removeItem("emailVerificationLastSent");
        setError("No user is logged in. Please sign in again.");
      }
      setIsChecking(false);
    });

    return () => unsubscribe();
  }, []);

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
        <div className="text-gray-600">
          We`ve sent a verification link to {email}
          <br />
          <br />
          <p className="font-semibold">
            Please check your
            <span className="text-red-500"> inbox or spam </span>folder
          </p>
        </div>
        <span className="text-sm text-gray-500">
          and click the link to verify your email address.
        </span>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div className="space-y-3">
          <Button
            onClick={handleResend}
            disabled={loading || cooldownTime > 0}
            variant="outline"
            className="w-fit border-none bg-blue-50 hover:bg-blue-100 text-slate-600"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Sending...
              </>
            ) : cooldownTime > 0 ? (
              `Resend in ${cooldownTime}s`
            ) : (
              `Resend Verification Email`
            )}
          </Button>

          <Button
            type="button"
            onClick={checkVerificationStatus}
            disabled={loading}
            variant="default"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Checking...
              </>
            ) : (
              "I've verified my email"
            )}
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={onBack}
          className="text-blue-600 hover:bg-blue-50 w-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In (Logout)
        </Button>
      </div>
    </div>
  );
}
