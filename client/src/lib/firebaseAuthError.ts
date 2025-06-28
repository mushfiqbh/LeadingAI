export function firebaseAuthError(error: unknown): string {
  if (!error) return "An unknown error occurred.";

  if (typeof error === "string") return error;

  if (typeof error === "object" && "code" in error) {
    switch (error.code) {
      case "auth/invalid-credential":
        return "Invalid credentials. Check your email and password.";
      case "auth/email-already-in-use":
        return "This email is already in use. Try logging in.";
      case "auth/invalid-email":
        return "The email address is invalid.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/popup-closed-by-user":
        return "The sign in popup was closed before completing.";
      default:
        return "Authentication error. Please try again.";
    }
  }

  if (typeof error === "object" && "message" in error) {
    return (error as { message?: string }).message ?? "An error occurred.";
  }

  return "An unexpected authentication error occurred.";
}
