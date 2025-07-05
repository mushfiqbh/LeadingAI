"use client";

import React from "react";
import ProtectedRoute from "@/components/general/ProtectedRoute";
import { 
  Clock, 
  MessageCircle, 
  Calendar, 
  Search, 
  Download, 
  Trash2, 
  Star, 
  ArrowRight, 
  Bot,
  ChevronDown,
  Archive
} from "lucide-react";

const HistoryPage = () => {
  // Mock data for chat history
  const chatHistory = [
    {
      id: "1",
      title: "Physics Problem Solutions",
      preview: "Can you help me solve this electromagnetic induction problem?",
      date: "2024-01-15",
      time: "14:30",
      messageCount: 12,
      isStarred: true,
      category: "Academic",
      lastMessage: "Thank you for the detailed explanation!"
    },
    {
      id: "2",
      title: "Class Schedule Query",
      preview: "What's my schedule for tomorrow?",
      date: "2024-01-14",
      time: "09:15",
      messageCount: 5,
      isStarred: false,
      category: "Schedule",
      lastMessage: "Here's your complete schedule for tomorrow..."
    },
    {
      id: "3",
      title: "Research Paper Discussion",
      preview: "I need help with my research methodology for machine learning project",
      date: "2024-01-13",
      time: "16:45",
      messageCount: 28,
      isStarred: true,
      category: "Research",
      lastMessage: "These resources should help you get started with your methodology."
    },
    {
      id: "4",
      title: "Exam Preparation Guide",
      preview: "How should I prepare for the upcoming calculus exam?",
      date: "2024-01-12",
      time: "11:20",
      messageCount: 15,
      isStarred: false,
      category: "Academic",
      lastMessage: "Follow this study plan for the next two weeks..."
    },
    {
      id: "5",
      title: "Course Registration Help",
      preview: "Which courses should I take next semester?",
      date: "2024-01-11",
      time: "13:55",
      messageCount: 8,
      isStarred: false,
      category: "Academic",
      lastMessage: "Based on your major, I recommend these courses..."
    },
    {
      id: "6",
      title: "Project Collaboration",
      preview: "Can you help me organize my group project tasks?",
      date: "2024-01-10",
      time: "15:10",
      messageCount: 22,
      isStarred: true,
      category: "Project",
      lastMessage: "Here's a structured approach to manage your team project."
    }
  ];

  const categories = ["All", "Academic", "Schedule", "Research", "Project"];
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredHistory = chatHistory.filter(chat => {
    const matchesCategory = selectedCategory === "All" || chat.category === selectedCategory;
    const matchesSearch = chat.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         chat.preview.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Academic": return "📚";
      case "Schedule": return "📅";
      case "Research": return "🔬";
      case "Project": return "🎯";
      default: return "💬";
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-6xl mx-auto px-6 py-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Chat History</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                This page is under construction
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Revisit your past conversations and find the information you need. 
                All your chats are organized and easily searchable.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold">42</div>
                <div className="text-sm text-gray-400">Total Chats</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-gray-400">Starred</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold">7</div>
                <div className="text-sm text-gray-400">This Week</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <Archive className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm text-gray-400">Total Messages</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="relative py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-3 bg-green-600/20 hover:bg-green-600/30 rounded-xl border border-green-500/30 transition-all duration-300">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button className="flex items-center gap-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 rounded-xl border border-red-500/30 transition-all duration-300">
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white/10 hover:bg-white/20 text-gray-300 border border-white/20'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat History List */}
            <div className="space-y-4">
              {filteredHistory.map((chat) => (
                <div
                  key={chat.id}
                  className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl">{getCategoryIcon(chat.category)}</div>
                        <div>
                          <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {chat.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {chat.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {chat.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {chat.messageCount} messages
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {chat.preview}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            chat.category === 'Academic' ? 'bg-blue-500/20 text-blue-300' :
                            chat.category === 'Schedule' ? 'bg-green-500/20 text-green-300' :
                            chat.category === 'Research' ? 'bg-purple-500/20 text-purple-300' :
                            'bg-orange-500/20 text-orange-300'
                          }`}>
                            {chat.category}
                          </span>
                          {chat.isStarred && (
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-gray-400">
                            {chat.lastMessage.substring(0, 50)}...
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredHistory.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-300 mb-2">No conversations found</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm ? "Try adjusting your search terms" : "Start a new conversation to see it here"}
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                  Start New Chat
                </button>
              </div>
            )}

            {/* Load More Button */}
            {filteredHistory.length > 0 && (
              <div className="text-center mt-12">
                <button className="group inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300">
                  Load More Conversations
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default HistoryPage;
