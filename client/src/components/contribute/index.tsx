"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/general/ProtectedRoute";
import NoticeShare from "./tabs/NoticeShare";
import RoutineShare from "./tabs/RoutineShare";
import DriveShare from "./tabs/DriveShare";

const ContributePage = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="min-h-screen py-10 relative overflow-hidden">
          <h1 className="text-2xl text-center font-bold mb-4 lg:mb-6 leading-tight">
            Contribute to AI Model Context
          </h1>

          <nav>
            <ul className="flex justify-center gap-6 my-8">
              {["Share Notices", "Share Routines", "Share Drives"].map((tab, index) => (
                <li key={index}>
                  <button
                    onClick={() => setActiveTab(index)}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                      activeTab === index
                        ? "text-indigo-600 bg-white/90 shadow-lg"
                        : "text-gray-600 hover:bg-white/20"
                    }`}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div>
            {activeTab == 0 && <NoticeShare />}
            {activeTab == 1 && <RoutineShare />}
            {activeTab == 2 && <DriveShare />}
          </div>
        </div>

        <div className="relative py-20 px-4 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-100/20 to-indigo-100/20"></div>
          <div className="relative max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Top Contributors
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Meet the amazing students who are helping build our academic
                community by sharing valuable resources
              </p>
            </div>

            {/* Contributors Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[
                {
                  name: "Farhan M.",
                  role: "CSE, Batch 62",
                  contributions: {
                    notesShared: 47,
                    routinesUpdated: 12,
                    noticesPosted: 8,
                  },
                  rating: 4.9,
                  points: 1247,
                },
                {
                  name: "Ahmed R.",
                  role: "CSE, Batch 62",
                  contributions: {
                    notesShared: 35,
                    routinesUpdated: 10,
                    noticesPosted: 5,
                  },
                  rating: 4.8,
                  points: 1100,
                },
                {
                  name: "Fatema S.",
                  role: "CSE, Batch 62",
                  contributions: {
                    notesShared: 30,
                    routinesUpdated: 8,
                    noticesPosted: 6,
                  },
                  rating: 4.7,
                  points: 1020,
                },
              ].map((contributor, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      {contributor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {contributor.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {contributor.role}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {Object.entries(contributor.contributions).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </span>
                          <span className="font-semibold text-blue-600">
                            {value}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm font-medium text-gray-700">
                        {contributor.rating}/5.0
                      </span>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full">
                      {contributor.points} pts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ContributePage;
