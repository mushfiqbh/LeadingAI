"use client";

import { useState, useEffect } from "react";
import { FolderPlus, Trash2 } from "lucide-react";
import {
  createDriveLinkInFirebase,
  fetchDriveLinksFromFirebase,
  deleteDriveLinkFromFirebase,
} from "@/lib/firestore";
import { Link } from "@/types/types";

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
    <div className="w-full mx-auto space-y-8 p-6">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow">
          <FolderPlus className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Share Drive Folder
          </h3>
          <p className="text-sm text-gray-600">
            Contribute resources for everyone
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl animate-in fade-in"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Drive Folder URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            placeholder="https://drive.google.com/drive/folders/..."
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            className="w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Semester 1 Materials"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            placeholder="Describe in details so AI can recognize the content"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            disabled={loading}
            rows={2}
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm mt-2 animate-in fade-in">
            Link saved! 🎉
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </div>
          ) : (
            "Save Link"
          )}
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-md font-semibold mb-2">Available Drive Links</h3>
        {links.length === 0 ? (
          <p className="text-gray-500">No drive links available.</p>
        ) : (
          <ul className="space-y-3">
            {links.map((link, idx) => (
              <li
                key={link.id}
                className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-100 shadow-sm flex flex-col gap-2 animate-in fade-in slide-in-from-left duration-300"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-blue-700">
                    {link.title}
                  </span>
                  <button
                    onClick={() => handleDelete(link.id)}
                    disabled={deletingId === link.id}
                    className="ml-4 p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors disabled:opacity-50"
                    title="Delete link"
                  >
                    {deletingId === link.id ? (
                      <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin inline-block"></span>
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {link.description && (
                  <p className="text-gray-700 text-sm mb-1">
                    {link.description}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 no-underline"
                  >
                    <FolderPlus className="w-4 h-4" />
                    Open Drive Folder
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(link.url)}
                    className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-xs font-medium transition-colors"
                    title="Copy link"
                  >
                    Copy Link
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
