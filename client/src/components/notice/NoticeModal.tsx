"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Notice } from "@/types/types";

export default function NoticeModal({
  notice,
  onClose,
}: {
  notice: Notice;
  onClose: () => void;
}) {
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
              By {notice.contributor?.fullName || "Anonymous"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {notice.expiryDate && notice.expiryDate !== "NO_EXPIRATION"
                ? `Expires: ${new Date(notice.expiryDate).toLocaleDateString()}`
                : "No expiration date"}
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
          {notice.information && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-lg text-center text-gray-800 mb-2">
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
