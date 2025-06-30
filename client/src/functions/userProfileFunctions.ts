import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { User } from "firebase/auth";
import { UserProfile } from "@/types";

export const getUserProfileFS = async (user: User) => {
  if (!user || !user.uid) {
    console.warn("No user or user ID provided");
    return null;
  }

  const userDocRef = doc(db, "users", user.uid);

  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      console.warn("User profile not found");
      return null;
    }
    const userProfile = { uid: userDoc.id, ...userDoc.data() } as UserProfile;
    return userProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const updateUserProfileFS = async (
  user: User,
  data: Partial<UserProfile>
) => {
  if (!user || !user.uid) {
    console.warn("No user or user ID provided");
    return null;
  }

  const userDocRef = doc(db, "users", user.uid);
  try {
    await updateDoc(userDocRef, data);
    console.log("User profile updated successfully");

    // Fetch the updated profile
    const updatedDoc = await getDoc(userDocRef);
    if (updatedDoc.exists()) {
      return { uid: updatedDoc.id, ...updatedDoc.data() } as UserProfile;
    } else {
      console.warn("Updated user profile not found");
      return null;
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
};
