import {
  doc,
  collection,
  getDocs,
  query,
  orderBy,
  limit as firestoreLimit,
  startAfter,
  DocumentSnapshot,
  deleteDoc,
  updateDoc,
  getDoc,
  addDoc,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { User } from "firebase/auth";
import { Link, Notice, Routine, RoutineBase, UserProfile } from "@/types/types";

export const getUserProfileFS = async (uid: string) => {
  if (!uid) {
    console.warn("No user ID provided");
    return null;
  }

  const userDocRef = doc(db, "users", uid);

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

// Get notices with pagination
export const getNoticesWithPagination = async (
  limitCount: number = 10,
  lastDoc?: DocumentSnapshot
) => {
  const noticesRef = collection(db, "notices");

  try {
    let q;
    const now = new Date().toISOString();

    if (lastDoc) {
      q = query(
        noticesRef,
        where("expiryDate", ">=", now),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        firestoreLimit(limitCount)
      );
    } else {
      q = query(
        noticesRef,
        where("expiryDate", ">=", now),
        orderBy("createdAt", "desc"),
        firestoreLimit(limitCount)
      );
    }

    const noticesSnapshot = await getDocs(q);

    if (noticesSnapshot.empty) {
      return {
        notices: [],
        lastDoc: null,
        hasMore: false,
      };
    }

    const notices = noticesSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Notice)
    );

    const lastDocument = noticesSnapshot.docs[noticesSnapshot.docs.length - 1];
    const hasMore = noticesSnapshot.docs.length === limitCount;

    return {
      notices,
      lastDoc: lastDocument,
      hasMore,
    };
  } catch (error) {
    console.error("Error fetching notices with pagination:", error);
    return {
      notices: [],
      lastDoc: null,
      hasMore: false,
    };
  }
};

export const deleteNotice = async (noticeId: string) => {
  if (!noticeId) {
    console.warn("No notice ID provided");
    return false;
  }

  const noticeDocRef = doc(db, "notices", noticeId);

  try {
    await deleteDoc(noticeDocRef);
    console.log("Notice deleted successfully");
    return true;
  } catch (error) {
    console.error("Error marking notice as deleted:", error);
    return false;
  }
};

export const getRoutinesWithPagination = async (
  limitCount: number = 10,
  lastDoc?: DocumentSnapshot
) => {
  const routinesRef = collection(db, "routines");

  try {
    let q;

    if (lastDoc) {
      q = query(
        routinesRef,
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        firestoreLimit(limitCount)
      );
    } else {
      q = query(
        routinesRef,
        orderBy("createdAt", "desc"),
        firestoreLimit(limitCount)
      );
    }

    const routinesSnapshot = await getDocs(q);
    if (routinesSnapshot.empty) {
      return {
        routines: [],
        lastDoc: null,
        hasMore: false,
      };
    }

    const routines = routinesSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Routine)
    );
    const lastDocument =
      routinesSnapshot.docs[routinesSnapshot.docs.length - 1];
    const hasMore = routinesSnapshot.docs.length === limitCount;
    return {
      routines,
      lastDoc: lastDocument,
      hasMore,
    };
  } catch (error) {
    console.error("Error fetching routines with pagination:", error);
    return {
      routines: [],
      lastDoc: null,
      hasMore: false,
    };
  }
};

export const createRoutineFS = async (
  routineData: RoutineBase
) => {
  try {
    const routinesRef = collection(db, "routines");
    const docRef = await addDoc(routinesRef, {
      ...routineData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating routine:", error);
    throw error;
  }
};

// Create drive link
export const createDriveLinkInFirebase = async (
  link: Omit<Link, "id" | "createdAt">
): Promise<string> => {
  try {
    const linkData = {
      ...link,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "links"), linkData);

    return docRef.id;
  } catch (error) {
    console.error("Error creating drive link:", error);
    throw error;
  }
};

// Fetch drive links
export const fetchDriveLinksFromFirebase = async (): Promise<Link[]> => {
  try {
    const snapshot = await getDocs(collection(db, "links"));
    const links: Link[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Link[];
    return links;
  } catch (error) {
    console.error("Error fetching drive links:", error);
    throw error;
  }
};

// Delete drive links
export const deleteDriveLinkFromFirebase = async (
  linkId: string
): Promise<void> => {
  try {
    const linkRef = doc(db, "links", linkId);
    await deleteDoc(linkRef);
  } catch (error) {
    console.error("Error deleting drive link:", error);
    throw error;
  }
};

/**
 * Fetch the latest class routine for a specific department
 */
export const getLatestClassRoutine = async (department: string) => {
  const routinesRef = collection(db, "routines");
  const q = query(
    routinesRef,
    where("category", "==", "class-routine"),
    where("department", "==", department),
    orderBy("createdAt", "desc"),
    firestoreLimit(1)
  );

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Routine;
    }
    return null;
  } catch (error) {
    console.error("Error fetching latest routine:", error);
    return null;
  }
};
