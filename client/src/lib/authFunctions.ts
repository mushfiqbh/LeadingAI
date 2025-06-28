import { auth, db } from "@/lib/firebaseClient";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  getAuth,
} from "firebase/auth";

export const signUpWithEmail = async (
  email: string,
  password: string,
  fullName: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update display name in Auth
    if (fullName) {
      await updateProfile(user, { displayName: fullName });
    }

    // Create Firestore user profile
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      fullName,
      createdAt: serverTimestamp(),
      emailVerified: user.emailVerified,
    });

    // Send verification email and wait for it to complete
    await sendEmailVerification(user, {
      url: `${window.location.origin}/`,
    });

    return {
      user,
      error: null,
      emailSent: true,
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      user: null,
      error,
      emailSent: false,
    };
  }
};

// Sign in with email/password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user };
  } catch (error) {
    console.error("Email sign-in error:", error);
    return { error };
  }
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  // Add any additional scopes you need
  provider.addScope("profile");
  provider.addScope("email");

  // Configure the sign-in behavior to handle the popup properly
  const auth = getAuth();
  auth.languageCode = "en";

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Create / update Firestore user profile
    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        email: user.email,
        fullName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: serverTimestamp(),
        emailVerified: user.emailVerified,
      },
      { merge: true }
    );

    return { user };
  } catch (error: unknown) {
    console.error("Google sign-in error:", error);
    // Handle specific errors
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code?: string }).code === "string"
    ) {
      const code = (error as { code: string }).code;
      if (code === "auth/popup-closed-by-user") {
        return { error: new Error("Sign in was cancelled. Please try again.") };
      } else if (code === "auth/cancelled-popup-request") {
        return { error: new Error("Sign in was cancelled. Please try again.") };
      } else if (code === "auth/popup-blocked") {
        return {
          error: new Error(
            "Popup was blocked. Please allow popups for this site."
          ),
        };
      }
    }
    return {
      error:
        error instanceof Error ? error : new Error("An unknown error occurred"),
    };
  }
};

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { error };
  }
};
