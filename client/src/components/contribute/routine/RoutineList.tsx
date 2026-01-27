import { Routine } from "@/types/types";
import { Calendar } from "lucide-react";
import Link from "next/link";

export default function RoutineList({ routines }: { routines: Routine[] }) {
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
    <ul className="space-y-6">
      {routines.map((routine) => (
        <li
          key={routine.id}
          className="group cursor-pointer bg-white/90 rounded-2xl transition-all duration-200 hover:-translate-y-1"
        >
          <Link
            href={routine.sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col md:flex-row items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 min-w-0 text-left">
              <h5 className="font-semibold text-md text-gray-800 mb-1">
                {routine.title}
              </h5>

              <div className="flex flex-wrap gap-2 items-center my-2">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  By {routine.contributor?.name || "Anonymous"}
                </span>

                {routine.semester && (
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                    {routine.semester}
                  </span>
                )}

                {routine.department && (
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                    {routine.department}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
