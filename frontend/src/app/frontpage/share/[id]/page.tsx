"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFrontPageStore } from "@/store/useFrontPageStore";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import FrontPageForm from "@/app/frontpage/_partials/FrontPageForm";

export default function SharedFrontPage() {
  const { id } = useParams();
  const router = useRouter();
  const { loadSharedFrontPage } = useFrontPageStore();
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    async function init() {
      if (id && typeof id === "string") {
        try {
          await loadSharedFrontPage(id);
        } catch {
          setError("This shared link is invalid or has expired.");
        } finally {
          setIsInitialLoading(false);
        }
      } else {
        setIsInitialLoading(false);
      }
    }
    init();
  }, [id, loadSharedFrontPage]);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-zinc-500 mb-4" />
        <h1 className="text-xl font-medium text-zinc-300">Loading shared front pages...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="h-16 w-16 text-red-400 mb-4" />
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Link Invalid</h1>
        <p className="text-zinc-400 mb-6 max-w-md">{error}</p>
        <Button onClick={() => router.push("/frontpage")}>
          Create New Front Page
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <div className="py-12">
        <div className="max-w-3xl mx-auto px-6 mb-8">
          <div className="bg-blue-900/30 border border-blue-700 rounded-2xl p-4 text-blue-300 text-sm flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>
              You&lsquo;re viewing shared front pages. You can edit the details below and download them as PDF.
            </p>
          </div>
        </div>
        <FrontPageForm />
      </div>
    </div>
  );
}
