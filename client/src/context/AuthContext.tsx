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
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

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
