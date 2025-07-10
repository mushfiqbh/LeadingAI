import { Routine } from "@/types/types";
import { X } from "lucide-react";

export default function RoutineModal({
  routine,
  onClose,
}: {
  routine: Routine;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl max-h-full p-4"
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
              {routine.title || "Class Routine"}
            </h3>
            <p className="text-gray-600">
              By {routine.contributor?.fullName || "Anonymous"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {routine.expiryDate &&
                `Expires: ${new Date(routine.expiryDate).toLocaleDateString()}`}
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <a
              href={routine.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              View Google Sheet
            </a>
            {routine.content && (
              <div className="w-full bg-gray-50 rounded-xl p-4 text-gray-700 text-sm">
                {routine.content}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
