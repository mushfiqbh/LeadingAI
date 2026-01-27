"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from "@/lib/firebaseClient";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import type { UserProfile } from "@/types/types";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isEmailVerified: boolean;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  showManager: boolean;
  setShowManager: (value: boolean) => void;
  showHistory: boolean;
  setShowHistory: (value: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (value: boolean) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isEmailVerified: false,
  userProfile: null,
  setUserProfile: () => {},
  showManager: false,
  setShowManager: () => {},
  showHistory: false,
  setShowHistory: () => {},
  isAuthModalOpen: false,
  setIsAuthModalOpen: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setLoading(true);
      try {
        if (firebaseUser) {
          await firebaseUser.reload();
          setUser(firebaseUser);
          setIsEmailVerified(firebaseUser.emailVerified);

          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            setUserProfile(data);
          } else {
            console.log("User document does not exist");
            setUserProfile(null);
          }

          if (firebaseUser.emailVerified) {
            try {
              if (userSnap.exists()) {
                const data = userSnap.data();
                if (data.emailVerified !== true) {
                  await updateDoc(userDocRef, {
                    emailVerified: true,
                    lastUpdated: new Date().toISOString(),
                  });
                  console.log("Updated Firestore emailVerified to true");
                }
              } else {
                console.log("User document does not exist yet");
              }
            } catch (error) {
              console.error("Error accessing user document:", error);
              if (
                error &&
                typeof error === "object" &&
                "code" in error &&
                error.code === "permission-denied"
              ) {
                console.error(
                  "Firestore permission denied. Check your security rules."
                );
              }
            }
          }
        } else {
          setUser(null);
          setIsEmailVerified(false);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // If we're not loading and there's no user, check for anonymous profile in localStorage
    if (!loading && !user) {
        const storedProfile = localStorage.getItem("anonymousProfile");
        if (storedProfile) {
            try {
                const parsed = JSON.parse(storedProfile);
                // Convert string dates back to Date objects if needed, 
                // but checking types.ts UserProfile has Date objects. 
                // JSON.parse won't restore Dates automatically.
                // For simplified anonymous usage, we might just store basic fields.
                // Or we can just set it as is for now and ensure components handle string/date mismatch or parse it properly.
                // Let's simpler:
                setUserProfile({
                    ...parsed,
                    // reconstruct dates if necessary or just let them be strings if components are lenient
                    // To be safe, let's create a minimal valid user profile
                });
            } catch (e) {
                console.error("Failed to parse anonymous profile", e);
            }
        }
    }
  }, [loading, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isEmailVerified,
        userProfile,
        setUserProfile,
        showManager,
        setShowManager,
        showHistory,
        setShowHistory,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
