import { Routine } from "@/types/types";
import {
  DocumentSnapshot,
  collection,
  getDocs,
  query,
  orderBy,
  limit as firestoreLimit,
  startAfter,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

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
  routineData: Omit<Routine, "id" | "createdAt" | "updatedAt">
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
