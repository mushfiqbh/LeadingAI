"use client";

import { useState, useEffect } from "react";
import { FolderPlus, Trash2 } from "lucide-react";
import {
  createDriveLinkInFirebase,
  fetchDriveLinksFromFirebase,
  deleteDriveLinkFromFirebase,
} from "@/lib/firestore";
import { Link } from "@/types/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function DriveShare() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [links, setLinks] = useState<Link[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch drive links from Firestore
  useEffect(() => {
    async function fetchLinks() {
      const data = await fetchDriveLinksFromFirebase();
      setLinks(data);
    }
    fetchLinks();
  }, []);

  // Handle form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!form.title || !form.url) {
      setError("Title and Drive folder URL are required.");
      return;
    }
    setLoading(true);
    try {
      await createDriveLinkInFirebase({
        title: form.title,
        description: form.description,
        url: form.url,
      });
      setForm({ title: "", description: "", url: "" });
      setSuccess(true);
      // Refresh list
      const data = await fetchDriveLinksFromFirebase();
      setLinks(data);
    } catch {
      setError("Failed to save. Try again.");
    }
    setLoading(false);
    setTimeout(() => setSuccess(false), 3000);
  }

  // Handle delete link
  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this link?"
    );
    if (!confirmed) return;
    setDeletingId(id);
    try {
      await deleteDriveLinkFromFirebase(id);
      setLinks((links) => links.filter((link) => link.id !== id));
    } catch {
      setError("Failed to delete link.");
    }
    setDeletingId(null);
  }

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-emerald-50/50 via-green-50/50 to-teal-50/50 rounded-2xl p-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="relative">
          <h3 className="text-lg font-bold text-gray-900">
            Share Drive Folder
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Contribute resources & materials
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">
            Drive Folder URL <span className="text-red-500">*</span>
          </label>
          <Input
            type="url"
            placeholder="https://drive.google.com/drive/folders/..."
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            disabled={loading}
            className="h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="e.g. Semester 1 Materials"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            disabled={loading}
            className="h-10 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">
            Description
          </label>
          <textarea
            placeholder="Brief description for AI recognition"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="w-full rounded-lg border-0 bg-gray-50 px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white disabled:opacity-50 transition-all"
            disabled={loading}
            rows={2}
          />
        </div>

        {error && (
          <div className="bg-red-50/80 px-3 py-2 rounded-lg animate-in slide-in-from-top-2">
            <p className="text-red-600 text-xs font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50/80 px-3 py-2 rounded-lg animate-in slide-in-from-top-2">
            <p className="text-green-600 font-medium text-xs">Link shared successfully!</p>
          </div>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-10 text-sm font-semibold bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sharing...
            </div>
          ) : (
            "Share Link"
          )}
        </Button>
      </form>

      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-semibold text-gray-600">
          {links.length} {links.length === 1 ? 'folder' : 'folders'} shared
        </h3>
        {links.length === 0 ? (
          <div className="text-center py-12 bg-gray-50/50 rounded-xl">
            <p className="text-gray-400 text-sm">No drive links yet</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {links.map((link, idx) => (
              <div
                key={link.id}
                className="group bg-white/60 backdrop-blur-sm rounded-xl p-3 hover:bg-white hover:shadow-sm transition-all duration-200 animate-in fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 truncate group-hover:text-green-600 transition-colors">
                      {link.title}
                    </h4>
                    {link.description && (
                      <p className="text-gray-500 text-xs leading-relaxed mt-0.5 line-clamp-2">
                        {link.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(link.id)}
                    disabled={deletingId === link.id}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50 shrink-0"
                    title="Delete"
                  >
                    {deletingId === link.id ? (
                      <span className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg transition-all duration-200 no-underline"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    Open
                  </a>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(link.url);
                    }}
                    className="px-3 py-1.5 h-auto text-xs rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

