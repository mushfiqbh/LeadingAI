"use client";

// import { useState, useEffect, useCallback, useRef } from "react";

export default function NotesForm() {
  // const [notes, setNotes] = useState<Note[]>([]);
  // const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  // const [fetchStatus, setFetchStatus] = useState<"idle" | "loading" | "error">(
  //     "loading"
  // );
  // const [loadingMore, setLoadingMore] = useState(false);
  // const [hasMore, setHasMore] = useState(true);
  // const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  // const initialLoadRef = useRef(false);
  // const loadingRef = useRef(false);

  // const NOTES_PER_PAGE = 1;

  // const fetchNotes = useCallback(
  //     async (reset: boolean = false) => {
  //     if (reset) {
  //         setFetchStatus("loading");
  //         setNotes([]);
  //         setLastDoc(null);
  //         setHasMore(true);
  //     } else {
  //         setLoadingMore(true);
  //     }

  //     try {
  //         const response = await getNotesWithPagination(
  //         NOTES_PER_PAGE,
  //         reset ? undefined : lastDoc || undefined
  //         );

  //         if (reset) {
  //         setNotes(response.notes);
  //         } else {
  //         setNotes((prev) => [...prev, ...response.notes]);
  //         }

  //         setLastDoc(response.lastDoc);
  //         setHasMore(response.hasMore);
  //         setFetchStatus("idle");
  //     } catch (err) {
  //         console.error("Error fetching notes:", err);
  //         setFetchStatus("error");
  //     } finally {
  //         setLoadingMore(false);
  //     }
  //     },
  //     [lastDoc]
  // );

  // const loadMoreNotes = useCallback(() => {
  //     if (
  //     !loadingMore &&
  //     hasMore &&
  //     fetchStatus === "idle" &&
  //     !loadingRef.current
  //     ) {
  //     loadingRef.current = true;
  //     fetchNotes(false).finally(() => {
  //         loadingRef.current = false;
  //     });
  //     }
  // }, [fetchNotes, hasMore, loadingMore, fetchStatus]);

  // Initial load
  // useEffect(() => {
  //     if (!initialLoadRef.current) {
  //     initialLoadRef.current = true;
  //     fetchNotes(true);
  //     }
  // }, [fetchNotes]);

  return <div>NOTES UNDER CONSTRUCTION</div>;
}
