"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Notice } from "@/types/types";
import { deleteNotice, getUserProfileFS } from "@/lib/firestore";
import { useEffect, useState } from "react";
import { UserProfile } from "@/types/types";

export default function NoticeModal({
  notice,
  onClose,
}: {
  notice: Notice;
  onClose: () => void;
}) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (notice.contributor?.uid) {
        const profile = await getUserProfileFS(notice.contributor.uid);
        setUserProfile(profile);
      }
    };
    fetchUserProfile();
  }, [notice.contributor]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 max-h-[90vh] overflow-y-scroll scroll-smooth">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {notice.title || "University Notice"}
            </h3>
            <p className="text-gray-600 font-medium">
              By {notice.contributor?.name || "Anonymous"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {notice.expiryDate &&
                `Expires: ${new Date(notice.expiryDate).toLocaleDateString()}`}
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative max-w-full">
              <Image
                width={800}
                height={450}
                src={notice.imageUrl}
                alt={notice.title || "Notice"}
                className="rounded-lg shadow-lg"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          {notice.information && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-lg text-center text-teal-600 mb-3">
                📋 Transcribed Information by AI
              </h4>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {notice.information}
              </p>
            </div>
          )}

          {userProfile?.isAdmin && (
            <div className="text-center pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  if (
                    confirm(
                      "Are you sure you want to delete this notice? This action cannot be undone."
                    )
                  ) {
                    deleteNotice(notice.id).then(() => {
                      onClose();
                    });
                  }
                }}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                🗑️ Delete Notice (Admin)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
