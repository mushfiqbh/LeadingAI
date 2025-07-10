import ProtectedRoute from "@/components/general/ProtectedRoute";
import { Bell, Calendar, FileText, Text } from "lucide-react";
import Link from "next/link";

const ContributePage = () => {
  const forms = [
    {
      name: "Upload Notices",
      link: "notices",
      icon: Bell,
      description: "Image of latest notice",
      color: "from-red-500 to-pink-500",
    },
    {
      name: "Class / Exam Routine",
      link: "routines",
      icon: Calendar,
      description: "Share Google sheet url of the routine",
      color: "from-orange-500 to-yellow-500",
    },
    {
      name: "Upload PDFs",
      link: "notes",
      icon: FileText,
      description: "Upload study materials you have",
      color: "from-purple-500 to-indigo-500",
    },
    {
      name: "Paste Any Notes",
      link: "notes",
      icon: Text,
      description: "Text content you want to share",
      color: "from-blue-500 to-cyan-500",
    }
    // {
    //   name: "Update Bus Schedule",
    //   link: "bus-schedule",
    //   icon: Bus,
    //   description: "Update image of bus schedule",
    //   color: "from-blue-500 to-cyan-500",
    // },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="py-10 relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="relative max-w-7xl mx-auto text-center p-5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6 leading-tight">
              Contribute to AI Model Context
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed px-4">
              Help your fellow students by sharing academic resources,
              schedules, and important notices. Together, we build a stronger
              academic community!
            </p>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
            {/* Navigation Cards Section */}
            <div className="mb-12 lg:mb-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {forms.map((form) => {
                  const IconComponent = form.icon;

                  return (
                    <Link
                      key={form.link}
                      href={`/contribute/${form.link}`}
                      className="group flex items-center relative p-4 lg:p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 active:scale-95 border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                    >
                      <div className="flex items-center justify-center gap-4">
                        <div
                          className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${form.color} text-white shadow-lg`}
                        >
                          <IconComponent className="w-5 h-5 lg:w-6 lg:h-6" />
                        </div>
                        <div className="flex-1 min-w-0 items-center">
                          <h3 className="font-semibold text-sm lg:text-base mb-1 leading-tight">
                            {form.name}
                          </h3>
                          <p className="text-xs lg:text-sm leading-relaxed text-gray-500 line-clamp-2">
                            {form.description}
                          </p>
                        </div>
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  );
                })}
              </div>
            </div>
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
              {/* Contributor 1 */}
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  🏆 #1
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    AR
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Ahmed Rahman
                    </h3>
                    <p className="text-sm text-gray-600">CSE, Batch 2021</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Notes Shared</span>
                    <span className="font-semibold text-blue-600">47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Routines Updated
                    </span>
                    <span className="font-semibold text-green-600">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Notices Posted
                    </span>
                    <span className="font-semibold text-purple-600">8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium text-gray-700">
                      4.9/5.0
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full">
                    1,247 pts
                  </div>
                </div>
              </div>

              {/* Contributor 2 */}
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="absolute top-4 right-4 bg-gradient-to-r from-gray-400 to-gray-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  🥈 #2
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    SK
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Sadia Khan
                    </h3>
                    <p className="text-sm text-gray-600">BBA, Batch 2020</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Notes Shared</span>
                    <span className="font-semibold text-blue-600">38</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Routines Updated
                    </span>
                    <span className="font-semibold text-green-600">15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Notices Posted
                    </span>
                    <span className="font-semibold text-purple-600">6</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium text-gray-700">
                      4.8/5.0
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-3 py-1 rounded-full">
                    1,089 pts
                  </div>
                </div>
              </div>

              {/* Contributor 3 */}
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  🥉 #3
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    MH
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Mahir Hassan
                    </h3>
                    <p className="text-sm text-gray-600">EEE, Batch 2022</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Notes Shared</span>
                    <span className="font-semibold text-blue-600">32</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Routines Updated
                    </span>
                    <span className="font-semibold text-green-600">9</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Notices Posted
                    </span>
                    <span className="font-semibold text-purple-600">11</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium text-gray-700">
                      4.7/5.0
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs px-3 py-1 rounded-full">
                    967 pts
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ContributePage;
