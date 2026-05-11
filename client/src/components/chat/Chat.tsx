"use client";

import React, { useMemo, useRef, useCallback, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Note, Document } from "@/types/types";
import { useChatStore } from "@/hooks/useChatStore";
import { useChatSession } from "@/hooks/useChatSession";
import { useChatApi } from "@/hooks/useChatApi";
import { ChatMessage } from "@/types/types";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { EmptyChat } from "./EmptyChat";
import { useChatListeners } from "@/hooks/useChatListeners";
import { Button } from "@/components/ui/Button";
import { 
  FileText, 
  Search, 
  Plus, 
  Settings, 
  Share2, 
  Layout, 
  ChevronRight,
  BookOpen,
  HelpCircle,
  Database,
  Menu,
  Sparkles,
  X,
  CircleUser,
  Check,
  LogOut,
  User as UserIcon,
  Home
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { EditDocumentModal } from "./EditDocumentModal";
import { getNotesFS } from "@/lib/firestore";
import Link from "next/link";
import Image from "next/image";
import { logout } from "@/lib/authFunctions";
import { useRouter } from "next/navigation";
import { GenerateRoutineModal } from "./GenerateRoutineModal";

const Chat: React.FC = () => {
  const { 
    user,
    setIsAuthModalOpen 
  } = useAuth();
  const { selectedConversationId, messages: storeMessages } = useChatStore();
  const router = useRouter();
  
  // Sidebar states
  const [isSourcesOpen, setIsSourcesOpen] = useState(false); // Closed by default on mobile
  const [isStudioOpen, setIsStudioOpen] = useState(false);  // Closed by default on mobile
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [chatInputText, setChatInputText] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Desktop check for initial state if possible (optional, keeping it simple with state)
  React.useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsSourcesOpen(true);
      setIsStudioOpen(true);
    }
  }, []);

  // Fetch documents from Supabase
  const fetchDocuments = useCallback(async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("id, file_name, mime_type, course_code, category, description")
      .order("indexed_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
    } else {
      setDocuments(data || []);
    }
  }, []);

  const fetchNotes = useCallback(async () => {
    if (user?.uid) {
      const fetchedNotes = await getNotesFS(user.uid);
      setNotes(fetchedNotes.slice(0, 4)); // Show only latest 4 in sidebar
    }
  }, [user?.uid]);

  React.useEffect(() => {
    fetchDocuments();
    fetchNotes();
  }, [fetchDocuments, fetchNotes]);

  // Debounce search query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredDocuments = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return documents;
    const query = debouncedSearchQuery.toLowerCase();
    return documents.filter(doc => 
      doc.file_name?.toLowerCase().includes(query) || 
      doc.course_code?.toLowerCase().includes(query) ||
      doc.category?.toLowerCase().includes(query) ||
      doc.description?.toLowerCase().includes(query)
    );
  }, [documents, debouncedSearchQuery]);

  // TTFB testing - track message send timeSlots
  const messageTimestamps = useRef<Map<string, number>>(new Map());
  const lastStreamingState = useRef<boolean>(false);

  // Custom hooks to manage logic
  useChatListeners(user?.uid || "");
  useChatSession();

  const {
    isLoading,
    isStreaming,
    error,
    statusMessage,
    handleSendMessage,
    handleRetry,
  } = useChatApi();

  const currentMessages = useMemo(() => {
    return selectedConversationId
      ? storeMessages[selectedConversationId] || []
      : [];
  }, [selectedConversationId, storeMessages]);

  // TTFB testing - wrap handleSendMessage to track timing
  const handleSendMessageWithLatency = useCallback(
    async (message: ChatMessage) => {
      const sendTime = performance.now();

      // Store the send time - we'll use the conversation ID as key since we don't have message ID yet
      if (selectedConversationId) {
        messageTimestamps.current.set(selectedConversationId, sendTime);
      }

      return handleSendMessage(message);
    },
    [handleSendMessage, selectedConversationId],
  );

  // TTFB testing - monitor for streaming start
  React.useEffect(() => {
    if (isStreaming && !lastStreamingState.current && selectedConversationId) {
      const sendTime = messageTimestamps.current.get(selectedConversationId);
      if (sendTime) {
        const firstChunkTime = performance.now();
        const timeToFirstChunk = firstChunkTime - sendTime;
        console.log("TTFB:", timeToFirstChunk.toFixed(2), "ms");

        // Clean up the timestamp
        messageTimestamps.current.delete(selectedConversationId);
      }
    }
    lastStreamingState.current = isStreaming;
  }, [isStreaming, selectedConversationId]);

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-gray-200 overflow-hidden dark relative">
      {/* Left Sidebar - Sources Overlay for Mobile */}
      {isSourcesOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 lg:hidden"
          onClick={() => setIsSourcesOpen(false)}
        />
      )}
      
      <div className={`
        fixed inset-y-0 left-0 z-70 lg:relative lg:z-0
        flex flex-col border-r border-white/10 bg-[#1a1a1a] transition-all duration-300
        ${isSourcesOpen ? 'w-70 translate-x-0 lg:w-80' : 'w-0 -translate-x-full overflow-hidden border-none lg:translate-x-0 lg:w-0 lg:border-none'}
      `}>
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Sources</h2>
          <Button variant="ghost" className="p-1 lg:hidden" onClick={() => setIsSourcesOpen(false)}>
            <X className="w-5 h-5 text-gray-500" />
          </Button>
          <Layout className="w-4 h-4 text-gray-500 cursor-pointer hidden lg:block" onClick={() => setIsSourcesOpen(false)} />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">          
          <a 
            href="https://drive.google.com/drive/folders/1AWbbVY_w18A3QkXPog0X7L3KKb4pmo4d" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-lg text-sm font-medium hover:bg-blue-600/20 transition-all justify-center"
          >
            <Plus className="w-4 h-4" />
            Add sources
          </a>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search sources..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map(doc => (
                <div 
                  key={doc.id} 
                  className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/5"
                  onClick={() => {
                    setSelectedDoc(doc);
                    setIsEditModalOpen(true);
                  }}
                >
                  <div className="p-1.5 bg-blue-500/10 rounded-md">
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{doc.file_name}</p>
                      {doc.course_code && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-md font-bold whitespace-nowrap">
                          {doc.course_code}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[10px] text-gray-500 uppercase">
                        {doc.mime_type?.split("/")[1] || (doc.file_name?.endsWith(".docx") ? "docx" : "file")}
                      </p>
                      {doc.category && (
                        <span className="text-xs text-indigo-400 font-medium truncate">• {doc.category}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 text-center py-4 italic">No sources found.</p>
            )}
          </div>
        </div>

        {/* Profile / Bottom Action Area */}
        <div className="p-4 border-t border-white/10 relative">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group"
              >
                <div className="relative">
                  {user.photoURL ? (
                    <Image
                      height={32}
                      width={32}
                      src={user.photoURL}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-lg object-cover ring-2 ring-transparent group-hover:ring-blue-500/50 transition-all"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                      <CircleUser className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#1a1a1a] rounded-full"></div>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
                <Settings className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
              </button>

              {showProfileMenu && (
                <div
                  ref={menuRef}
                  className="absolute bottom-full left-0 w-full mb-2 bg-[#1a1a1a] rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl z-80 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
                >
                  <div className="p-4 bg-white/5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <strong className="text-gray-100 font-semibold truncate">
                            {user.displayName || "Anonymous"}
                          </strong>
                          {user.emailVerified && (
                            <Check className="w-4 h-4 text-green-500 shrink-0" />
                          )}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {user.email || "No email provided"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 space-y-1">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <UserIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Profile</span>
                    </Link>

                    <Link
                      href="/"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Home className="w-4 h-4" />
                      <span className="text-sm font-medium">Home</span>
                    </Link>

                    {/* <button
                      onClick={() => {
                        setShowManager(true);
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-blue-400 hover:text-blue-300"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">AI Credits</span>
                    </button> */}

                    <div className="pt-1 mt-1 border-t border-white/10">
                      <button
                        onClick={() => {
                          logout();
                          router.push("/");
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-red-500"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4 rotate-180" />
              Sign In
            </Button>
          )}
        </div>
      </div>

      <GenerateRoutineModal 
        isOpen={isRoutineModalOpen} 
        onClose={() => setIsRoutineModalOpen(false)} 
        onGenerate={(message) => {
          setChatInputText(message);
        }}
      />

      {/* Main Content - Chat Area */}
      <div className="flex-1 flex flex-col relative h-full bg-[#121212] min-w-0">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-white/5 bg-[#121212]/80 backdrop-blur-md z-50 sticky top-0">
          <div className="flex items-center gap-3">
            <button 
              className="p-2 hover:bg-white/5 rounded-lg lg:hidden"
              onClick={() => setIsSourcesOpen(true)}
            >
              <Menu className="w-5 h-5 text-gray-400" />
            </button>
            {!isSourcesOpen && (
              <Layout 
                className="w-5 h-5 text-gray-500 cursor-pointer hidden lg:block hover:text-gray-300 transition-colors" 
                onClick={() => setIsSourcesOpen(true)} 
              />
            )}
            <h1 className="text-sm lg:text-lg font-semibold bg-linear-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent truncate max-w-37.5 sm:max-w-75 lg:max-w-md">
              Leading AI Chat
            </h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="p-2 hover:bg-white/5 rounded-full"><Share2 className="w-4 h-4 lg:w-4 lg:h-4 text-gray-400 hover:text-white" /></button>
            <button className="p-2 hover:bg-white/5 rounded-full"><Settings className="w-4 h-4 lg:w-4 lg:h-4 text-gray-400 hover:text-white" /></button>
            {!isStudioOpen && (
              <button 
              className="p-2 hover:bg-white/5 rounded-full text-indigo-400"
              onClick={() => setIsStudioOpen(true)}
              >
                <Sparkles className="w-5 h-5" />
              </button>
            )}
          </div>
        </header>

        {/* Scrollable message area */}
        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950">
          <div className="max-w-4xl mx-auto w-full px-2 sm:px-6 pt-4 lg:pt-8 pb-32">
            {currentMessages.length === 0 ? (
              <EmptyChat userName={user?.displayName?.split(" ")[0]} />
            ) : (
              <MessageList
                messages={currentMessages}
                isStreaming={isStreaming}
                statusMessage={statusMessage}
                error={error}
                onRetry={handleRetry}
              />
            )}
          </div>
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-2 sm:px-4 pointer-events-none z-50">
          <div className="pointer-events-auto">
            <ChatInput
              onSendMessage={handleSendMessageWithLatency}
              isLoading={isLoading || isStreaming}
              inputValue={chatInputText}
              onInputChange={setChatInputText}
            />
          </div>
          <p className="text-[9px] lg:text-[10px] text-center mt-2 text-gray-500 lg:block hidden">
            LeadingAI can be inaccurate; please double check its responses.
          </p>
        </div>
      </div>

      {/* Right Sidebar - Studio Overlay for Mobile */}
      {isStudioOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 lg:hidden"
          onClick={() => setIsStudioOpen(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 right-0 z-70 lg:relative lg:z-0
        flex flex-col border-l border-white/10 bg-[#1a1a1a] transition-all duration-300
        ${isStudioOpen ? 'w-75 translate-x-0 lg:w-80' : 'w-0 translate-x-full overflow-hidden border-none lg:translate-x-0 lg:w-0 lg:border-none'}
      `}>
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Studio</h2>
          <Button variant="ghost" className="p-1 lg:hidden" onClick={() => setIsStudioOpen(false)}>
            <X className="w-5 h-5 text-gray-500" />
          </Button>
          <Layout className="w-4 h-4 text-gray-500 cursor-pointer transform rotate-180 hidden lg:block" onClick={() => setIsStudioOpen(false)} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          <div className="p-4 rounded-xl bg-linear-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-indigo-300">My Notes</p>
              <Link href="/notes" className="text-[10px] text-indigo-400 hover:text-indigo-300 underline">View all</Link>
            </div>
            <div className="space-y-2">
              {notes.length > 0 ? (
                notes.map(note => (
                  <div key={note.id} className="p-2 rounded-lg bg-white/5 border border-white/5 text-[11px] text-gray-400 line-clamp-2">
                    {note.content}
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-gray-500 italic py-2">No notes saved yet.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-2 gap-2">
             <a href="/frontpage" className="group p-3 sm:p-4 lg:p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer transition-all hover:bg-white/8">
                <div className={`w-8 h-8 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center mb-3 bg-green-500/10`}>
                  <FileText className={`w-4 h-4 text-green-400`} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] lg:text-xs font-medium text-gray-300">Generate Frontpage</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-600 mt-2 opacity-0 lg:group-hover:opacity-100 transition-opacity" />
              </a>

            {[
              { icon: Layout, label: "Notice / News", color: "amber" },
              { icon: BookOpen, label: "Generate Routine", color: "blue", onClickHandler: () => setIsRoutineModalOpen(true) },
              { icon: HelpCircle, label: "Exam Preparation", color: "purple" },
              { icon: Layout, label: "Lab Reports", color: "orange" },
              { icon: Layout, label: "Flashcards", color: "rose" },
              { icon: HelpCircle, label: "Quiz", color: "blue" },
              { icon: Database, label: "Data Table", color: "slate" }
            ].map((tool, i) => (
              <div key={i} onClick={tool.onClickHandler ?? (() => {})} className="group p-3 sm:p-4 lg:p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer transition-all hover:bg-white/8">
                <div className={`w-8 h-8 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center mb-3 bg-${tool.color}-500/10`}>
                  <tool.icon className={`w-4 h-4 text-${tool.color}-400`} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] lg:text-xs font-medium text-gray-300">{tool.label}</span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-600 mt-2 opacity-0 lg:group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <EditDocumentModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        document={selectedDoc}
        onSave={fetchDocuments}
      />
    </div>
  );
};

export default Chat;
