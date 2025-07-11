import { Routine } from "@/types/types";
import { Calendar } from "lucide-react";
import Link from "next/link";

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
    <ul className="space-y-6">
      {routines.map(
        (routine) =>
          routine.status !== "pending" &&
          routine.status !== "error" && (
            <li
              key={routine.id}
              onClick={() => onSelect(routine)}
              className="group cursor-pointer bg-white/90 rounded-2xl transition-all duration-200 hover:-translate-y-1"
            >
              <Link
                href={routine.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col md:flex-row items-center gap-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex-1 min-w-0 text-left">
                  {routine.status === "sent" && (
                    <h5 className="font-semibold text-base text-blue-700 mb-1 pulse">
                      AI Model Processing This Google Sheet
                    </h5>
                  )}
                  {routine.status === "done" && (
                    <h5 className="font-semibold text-lg text-gray-800 mb-1">
                      {routine.title}
                    </h5>
                  )}

                  <p className="w-fit text-xs px-2 py-1 rounded-full bg-blue-100 text-slate-400 font-semibold">
                    {routine.category.replace("-", " ").toUpperCase()}
                  </p>

                  <div className="flex gap-2 items-center my-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      By {routine.contributor?.name || "Anonymous"}
                    </span>
                    {routine.expiryDate && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        Expires:{" "}
                        {new Date(routine.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          )
      )}
    </ul>
  );
}
