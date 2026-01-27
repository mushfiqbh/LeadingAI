"use client";

import RoutineUploadForm from "@/components/contribute/routine/RoutineUploadForm";
import RoutineList from "@/components/contribute/routine/RoutineList";
import { getRoutinesWithPagination } from "@/lib/firestore";
import { Routine } from "@/types/types";
import { DocumentSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";

export default function RoutineShare() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [fetchStatus, setFetchStatus] = useState<"idle" | "loading" | "error">(
    "loading"
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const initialLoadRef = useRef(false);
  const loadingRef = useRef(false);
  
  const ROUTINES_PER_PAGE = 3;

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
    <div className="w-full md:w-1/2 mx-auto p-6">
      <RoutineUploadForm onUploadSuccess={() => fetchRoutines(true)} />

      <div className="mt-8">
        <h4 className="text-lg font-semibold opacity-50 mt-6 mb-3">
          Recent Routines
        </h4>
        {fetchStatus === "loading" ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">Loading routines...</span>
            </div>
          </div>
        ) : fetchStatus === "error" ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            <p className="text-sm">
              Failed to load routines. Please try again later.
            </p>
          </div>
        ) : (
          <>
            <RoutineList routines={routines} />

            {/* Loading more indicator for infinite scroll */}
            {loadingMore && (
              <div className="flex items-center justify-center py-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600">Loading more notices...</span>
                </div>
              </div>
            )}

            {!hasMore && routines.length > 0 && (
              <div className="mt-6 text-center py-4">
                <p className="text-gray-500 text-sm">
                  You&apos;ve reached the end of all routines
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
