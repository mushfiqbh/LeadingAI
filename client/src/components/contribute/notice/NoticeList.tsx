import Image from "next/image";
import { ZoomIn, Bell } from "lucide-react";
import { Notice } from "@/types/types";

export default function NoticeList({
  notices,
  onSelect,
}: {
  notices: Notice[];
  onSelect: (notice: Notice) => void;
}) {
  if (notices.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No notices available yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Be the first to upload a notice!
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-6">
      {notices.map((notice) => (
        <li
          key={notice.id}
          onClick={() => onSelect(notice)}
          className="group flex items-center gap-5 cursor-pointer bg-white/90 hover:border-blue-400 transition-all duration-200 hover:-translate-y-1"
        >
          <div className="h-20 w-20 relative group flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
            <Image
              fill
              sizes="(max-width: 80px) 80px, 100vw"
              src={notice.imageUrl}
              alt={notice.title || "Notice"}
              className="rounded-xl object-cover transition-all duration-200 group-hover:brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30 rounded-xl">
              <ZoomIn className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h5 className="text-md font-semibold text-gray-800 mb-1">
              {notice.title || "University Notice"}
            </h5>
            <div className="flex flex-wrap gap-2 items-center mb-1">
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                By {notice.contributor?.name || "Anonymous"}
              </span>
              {notice.expiryDate &&
                (() => {
                  const expiry = new Date(notice.expiryDate.valueOf());
                  const now = new Date();

                  expiry.setHours(0, 0, 0, 0);
                  now.setHours(0, 0, 0, 0);

                  const isExpired = expiry < now;

                  return isExpired ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                      Expired
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                      Expires: {expiry.toString().split("00")[0]}
                    </span>
                  );
                })()}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
