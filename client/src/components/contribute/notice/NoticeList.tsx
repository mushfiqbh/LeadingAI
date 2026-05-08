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
      <div className="text-center py-12 bg-gray-50/50 rounded-xl">
        <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-400 text-sm">No notices available yet</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {notices.map((notice, idx) => (
        <div
          key={notice.id}
          onClick={() => onSelect(notice)}
          className="group flex items-center gap-3 cursor-pointer bg-white/60 backdrop-blur-sm rounded-xl p-3 hover:bg-white hover:shadow-sm transition-all duration-200 animate-in fade-in"
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          <div className="h-14 w-14 relative flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              fill
              sizes="56px"
              src={notice.imageUrl}
              alt={notice.title || "Notice"}
              className="object-cover transition-all duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/10">
              <ZoomIn className="w-4 h-4 text-white drop-shadow" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="font-semibold text-sm text-gray-900 truncate group-hover:text-orange-600 transition-colors">
              {notice.title || "University Notice"}
            </h5>
            <div className="flex flex-wrap gap-1.5 items-center mt-1">
              <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
                {notice.contributor?.name || "Anonymous"}
              </span>
              {notice.expiryDate &&
                (() => {
                  const expiry = new Date(notice.expiryDate.valueOf());
                  const now = new Date();
                  expiry.setHours(0, 0, 0, 0);
                  now.setHours(0, 0, 0, 0);
                  const isExpired = expiry < now;

                  return isExpired ? (
                    <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-600">
                      Expired
                    </span>
                  ) : (
                    <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-green-50 text-green-600">
                      Active
                    </span>
                  );
                })()}
            </div>
          </div>
          <div className="text-gray-400 group-hover:text-orange-500 transition-all flex-shrink-0">
            <ZoomIn className="w-4 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
