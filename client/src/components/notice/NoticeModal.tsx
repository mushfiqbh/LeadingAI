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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-0 -right-0 z-10 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="bg-white rounded-2xl p-4 max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="text-center mb-4">
            <h3 className="font-bold text-gray-800 mb-2">
              {notice.title || "University Notice"}
            </h3>
            <p className="text-gray-600">
              By {notice.contributor?.name || "Anonymous"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {notice.expiryDate &&
                `Expires: ${new Date(notice.expiryDate).toLocaleDateString()}`}
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              width={800}
              height={600}
              src={notice.imageUrl}
              alt={notice.title || "Notice"}
              className="max-w-full h-auto rounded-lg shadow-lg"
              style={{ objectFit: "contain" }}
            />
          </div>
          {userProfile?.isAdmin && (
            <div className="mt-4 text-center">
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
                className="px-4 py-2 text-red-500 rounded-lg underline cursor-pointer"
              >
                Delete this Notice as Admin
              </button>
            </div>
          )}
          
          {notice.information && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-lg text-center text-green-400 mb-2">
                Transcribed Information by AI
              </h4>
              <p className="text-gray-700 whitespace-pre-wrap">
                {notice.information}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
