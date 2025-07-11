"use client";

import RoutineUploadForm from "@/components/routine/RoutineUploadForm";
import RoutineList from "@/components/routine/RoutineList";
import RoutineModal from "@/components/routine/RoutineModal";
import { getRoutinesWithPagination } from "@/lib/routine";
import { Routine } from "@/types/types";
import { DocumentSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ClassRoutinePage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [fetchStatus, setFetchStatus] = useState<"idle" | "loading" | "error">(
    "loading"
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const initialLoadRef = useRef(false);
  const loadingRef = useRef(false);
  const ROUTINES_PER_PAGE = 5;

  const fetchRoutines = useCallback(
    async (reset: boolean = false) => {
      if (reset) {
        setFetchStatus("loading");
        setRoutines([]);
        setLastDoc(null);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }
      try {
        const response = await getRoutinesWithPagination(
          ROUTINES_PER_PAGE,
          reset ? undefined : lastDoc || undefined
        );
        if (reset) {
          setRoutines(response.routines);
        } else {
          setRoutines((prev) => [...prev, ...response.routines]);
        }
        setLastDoc(response.lastDoc);
        setHasMore(response.hasMore);
        setFetchStatus("idle");
      } catch {
        setFetchStatus("error");
      } finally {
        setLoadingMore(false);
      }
    },
    [lastDoc]
  );

  const loadMoreRoutines = useCallback(() => {
    if (
      !loadingMore &&
      hasMore &&
      fetchStatus === "idle" &&
      !loadingRef.current
    ) {
      loadingRef.current = true;
      fetchRoutines();
      setTimeout(() => (loadingRef.current = false), 1000);
    }
  }, [loadingMore, hasMore, fetchStatus, fetchRoutines]);

  useEffect(() => {
    if (!initialLoadRef.current) {
      fetchRoutines(true);
      initialLoadRef.current = true;
    }
    // Infinite scroll
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        hasMore &&
        !loadingMore &&
        fetchStatus === "idle"
      ) {
        loadMoreRoutines();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchRoutines, hasMore, loadingMore, fetchStatus, loadMoreRoutines]);

  return (
    <div className="w-full md:w-1/2 mx-auto py-6">
      <RoutineUploadForm onUploadSuccess={() => fetchRoutines(true)} />
      <div className="mt-8 px-6">
        <h4 className="font-semibold text-lg text-gray-800 mb-4">
          Recent Routines
        </h4>
        <RoutineList routines={routines} onSelect={setSelectedRoutine} />
      </div>
      {selectedRoutine && (
        <RoutineModal
          routine={selectedRoutine}
          onClose={() => setSelectedRoutine(null)}
        />
      )}
    </div>
  );
}
