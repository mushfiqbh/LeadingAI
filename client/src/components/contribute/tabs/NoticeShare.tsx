"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Notice } from "@/types/types";
import { getNoticesWithPagination } from "@/lib/firestore";
import { DocumentSnapshot } from "firebase/firestore";
import NoticeModal from "@/components/contribute/notice/NoticeModal";
import NoticeList from "@/components/contribute/notice/NoticeList";
import NoticeUploadForm from "@/components/contribute/notice/NoticeUploadForm";

export default function NoticeShare() {
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

  const NOTICES_PER_PAGE = 3;

  const fetchNotices = useCallback(
    async (reset: boolean = false) => {
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
          setNotices((prev) => [...prev, ...response.notices]);
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
    },
    [lastDoc]
  ); // Keep dependency but we'll optimize the loadMoreNotices callback

  const loadMoreNotices = useCallback(() => {
    if (
      !loadingMore &&
      hasMore &&
      fetchStatus === "idle" &&
      !loadingRef.current
    ) {
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
    <div id="notices-form" className="w-full mx-auto space-y-8">
      <NoticeUploadForm onUploadSuccess={() => fetchNotices(true)} />

      <div className="mt-6 pt-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">Recent Notices</h4>
        <div>
          {fetchStatus === "loading" ? (
            <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl border border-orange-100">
              <span className="text-gray-600 font-medium">Loading notices...</span>
            </div>
          ) : fetchStatus === "error" ? (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-2xl shadow-sm">
              <p className="text-sm font-medium">
                Failed to load notices. Please refresh the page to try again.
              </p>
            </div>
          ) : (
            <>
              <NoticeList notices={notices} onSelect={setSelectedNotice} />

              {/* Loading more indicator for infinite scroll */}
              {loadingMore && (
                <div className="flex items-center justify-center py-6 mt-6">
                  <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-3 rounded-full border border-orange-200 shadow-sm">
                    <div className="w-5 h-5 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600 font-medium">
                      Loading more notices...
                    </span>
                  </div>
                </div>
              )}

              {!hasMore && notices.length > 0 && (
                <div className="mt-8 text-center py-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                  <p className="text-gray-600 text-sm font-medium">
                    You've reached the end of all notices ✨
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedNotice && (
        <NoticeModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}
    </div>
  );
}
