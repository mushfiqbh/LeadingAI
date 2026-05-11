"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getNotesFS, deleteNoteFS } from "@/lib/firestore";
import { Button } from "@/components/ui/Button";
import { Trash2, ArrowLeft, Search, FileText } from "lucide-react";
import Link from "next/link";
import { formatTime } from "@/utils/formatFirebaseTimestamp";
import { Note } from "@/types/types";

export default function NotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      if (user?.uid) {
        const fetchedNotes = await getNotesFS(user.uid);
        setNotes(fetchedNotes);
      }
      setLoading(false);
    };

    fetchNotes();
  }, [user?.uid]);

  const handleDelete = async (noteId: string) => {
    if (!user || !confirm("Are you sure you want to delete this note?")) return;
    const success = await deleteNoteFS(user.uid, noteId);
    if (success) {
      setNotes(notes.filter((n) => n.id !== noteId));
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/chat">
              <Button variant="ghost" className="p-2 hover:bg-white/5 rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold bg-linear-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
              My Notes
            </h1>
          </div>
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="grid gap-4">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider">
                      <FileText className="w-3 h-3 text-blue-400" />
                      <span>{typeof note.source === 'string' && note.source ? note.source : "Chat"}</span>
                      <span>•</span>
                      <span>{formatTime(note.createdAt)}</span>
                    </div>
                    <p className="text-[15px] leading-relaxed text-gray-300 whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No notes found.</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-blue-400 text-sm mt-2 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
