"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Notice } from "@/types/types";
import { getNoticesWithPagination } from "@/lib/firestore";
import { DocumentSnapshot } from "firebase/firestore";
import NoticeModal from "@/components/notice/NoticeModal";
import NoticeList from "@/components/notice/NoticeList";
import NoticeUploadForm from "@/components/notice/NoticeUploadForm";

export default function NoticesForm() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [fetchStatus, setFetchStatus] = useState<"idle" | "loading" | "error">(
    "loading"
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const initialLoadRef = useRef(false);
  const loadingRef = useRef(false);

  const NOTICES_PER_PAGE = 1;

  const fetchNotices = useCallback(async (reset: boolean = false) => {
    if (reset) {
      setFetchStatus("loading");
      setNotices([]);
      setLastDoc(null);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await getNoticesWithPagination(
        NOTICES_PER_PAGE,
        reset ? undefined : lastDoc || undefined
      );

      if (reset) {
        setNotices(response.notices);
      } else {
        setNotices(prev => [...prev, ...response.notices]);
      }

      setLastDoc(response.lastDoc);
      setHasMore(response.hasMore);
      setFetchStatus("idle");
    } catch (err) {
      console.error("Error fetching notices:", err);
      setFetchStatus("error");
    } finally {
      setLoadingMore(false);
    }
  }, [lastDoc]); // Keep dependency but we'll optimize the loadMoreNotices callback

  const loadMoreNotices = useCallback(() => {
    if (!loadingMore && hasMore && fetchStatus === "idle" && !loadingRef.current) {
      loadingRef.current = true;
      fetchNotices(false).finally(() => {
        loadingRef.current = false;
      });
    }
  }, [fetchNotices, loadingMore, hasMore, fetchStatus]);

  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      fetchNotices(true);
    }
  }, [fetchNotices]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 // Load 1000px before bottom
      ) {
        loadMoreNotices();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreNotices]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedNotice) setSelectedNotice(null);
    };
    if (selectedNotice) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedNotice]);

  return (
    <div id="notices-form" className="flex flex-col items-center justify-center min-h-screen py-8">
      {selectedNotice && (
        <NoticeModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}

      <div className="w-full md:w-1/2 mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
        <NoticeUploadForm onUploadSuccess={() => fetchNotices(true)} />

        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
            Recent Notices
          </h4>
          {fetchStatus === "loading" ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading notices...</span>
              </div>
            </div>
          ) : fetchStatus === "error" ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              <p className="text-sm">Failed to load notices. Please refresh the page to try again.</p>
            </div>
          ) : (
            <>
              <NoticeList notices={notices} onSelect={setSelectedNotice} />
              
              {/* Loading more indicator for infinite scroll */}
              {loadingMore && (
                <div className="flex items-center justify-center py-4 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600">Loading more notices...</span>
                  </div>
                </div>
              )}
              
              {!hasMore && notices.length > 0 && (
                <div className="mt-6 text-center py-4">
                  <p className="text-gray-500 text-sm">You&apos;ve reached the end of all notices</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
