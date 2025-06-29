"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from "@/lib/firebaseClient";
import type { User } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isEmailVerified: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isEmailVerified: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        await firebaseUser.reload();
        setUser(firebaseUser);
        setIsEmailVerified(firebaseUser.emailVerified);

        if (firebaseUser.emailVerified) {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            if (!data.emailVerified) {
              await updateDoc(userDocRef, { emailVerified: true });
              console.log("Updated Firestore emailVerified to true");
            }
          }
        }
      } else {
        setUser(null);
        setIsEmailVerified(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isEmailVerified }}>
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
