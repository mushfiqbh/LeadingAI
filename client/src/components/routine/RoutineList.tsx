import { Routine } from "@/types/types";
import Image from "next/image";
import { ZoomIn, Calendar } from "lucide-react";

export default function RoutineList({
  routines,
  onSelect,
}: {
  routines: Routine[];
  onSelect: (routine: Routine) => void;
}) {
  if (routines.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No routines available yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Be the first to upload a routine!
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {routines.map((routine) => (
        <li
          key={routine.id}
          onClick={() => onSelect(routine)}
          className="flex items-start gap-3 p-3 cursor-pointer bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <div className="h-16 w-16 relative group cursor-pointer">
            <Image
              fill
              sizes="(max-width: 64px) 64px, 100vw"
              src={routine.url}
              alt={routine.title || "Routine"}
              className="rounded-lg object-cover transition-all duration-200 group-hover:brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20 rounded-lg">
              <ZoomIn className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="font-semibold text-gray-800">
              {routine.title || "Class Routine"}
            </h5>
            <p className="text-sm text-gray-600">
              By {routine.contributor?.fullName || "Anonymous"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {routine.expiryDate &&
                `Expires: ${new Date(routine.expiryDate).toLocaleDateString()}`}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
