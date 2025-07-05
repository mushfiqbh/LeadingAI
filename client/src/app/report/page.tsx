import React from "react";
import ProtectedRoute from "@/components/general/ProtectedRoute";
import {
  BarChart3,
  TrendingUp,
  Clock,
  MessageCircle,
  Star,
  Download,
  Filter,
  RefreshCw,
  Activity,
  Target,
  Zap,
  Award,
  PieChart,
  LineChart,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

const ReportPage = () => {
  // Mock data for analytics
  const weeklyStats = [
    { day: "Mon", messages: 12, sessions: 3 },
    { day: "Tue", messages: 18, sessions: 4 },
    { day: "Wed", messages: 25, sessions: 6 },
    { day: "Thu", messages: 15, sessions: 4 },
    { day: "Fri", messages: 22, sessions: 5 },
    { day: "Sat", messages: 8, sessions: 2 },
    { day: "Sun", messages: 14, sessions: 3 },
  ];

  const topTopics = [
    { topic: "Physics Problems", count: 45, trend: "+12%" },
    { topic: "Schedule Queries", count: 32, trend: "+8%" },
    { topic: "Assignment Help", count: 28, trend: "+15%" },
    { topic: "Course Information", count: 22, trend: "+5%" },
    { topic: "Research Assistance", count: 18, trend: "+20%" },
  ];

  const recentAlerts = [
    {
      type: "info",
      message: "New feature: Image upload now available",
      time: "2 hours ago",
    },
    {
      type: "warning",
      message: "High usage detected - consider upgrading",
      time: "1 day ago",
    },
    {
      type: "success",
      message: "Monthly report generated successfully",
      time: "2 days ago",
    },
    {
      type: "error",
      message: "Connection timeout resolved",
      time: "3 days ago",
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
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
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Analytics Dashboard</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Usage Reports Page Under Construction
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Track your AI assistant usage, analyze conversation patterns,
                and optimize your learning experience with detailed insights and
                analytics.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Export Report
              </button>
              <button className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20">
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                Refresh Data
              </button>
              <button className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20">
                <Filter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="relative py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Total Messages */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    +12.5%
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">1,247</h3>
                <p className="text-gray-400 text-sm">Total Messages</p>
              </div>

              {/* Active Sessions */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    +8.3%
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">89</h3>
                <p className="text-gray-400 text-sm">Active Sessions</p>
              </div>

              {/* Average Response Time */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    -15.2%
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">0.8s</h3>
                <p className="text-gray-400 text-sm">Avg Response Time</p>
              </div>

              {/* Satisfaction Score */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    +2.1%
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">4.8</h3>
                <p className="text-gray-400 text-sm">Satisfaction Score</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Weekly Activity Chart */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-blue-400" />
                    Weekly Activity
                  </h3>
                  <button className="text-sm text-gray-400 hover:text-white transition-colors">
                    View Details
                  </button>
                </div>
                <div className="space-y-4">
                  {weeklyStats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium w-8">
                          {stat.day}
                        </span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2 min-w-[100px]">
                          <div
                            className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                            style={{ width: `${(stat.messages / 25) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          {stat.messages}
                        </div>
                        <div className="text-xs text-gray-400">
                          {stat.sessions} sessions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Topics */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-green-400" />
                    Top Discussion Topics
                  </h3>
                  <button className="text-sm text-gray-400 hover:text-white transition-colors">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {topTopics.map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{topic.topic}</div>
                          <div className="text-sm text-gray-400">
                            {topic.count} conversations
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-green-400 font-semibold">
                          {topic.trend}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  Recent Alerts & Notifications
                </h3>
                <button className="text-sm text-gray-400 hover:text-white transition-colors">
                  Mark All Read
                </button>
              </div>
              <div className="space-y-3">
                {recentAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-200">
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Accuracy Rate</h3>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  94.7%
                </div>
                <p className="text-sm text-gray-400">
                  Response accuracy this month
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Uptime</h3>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  99.9%
                </div>
                <p className="text-sm text-gray-400">System availability</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">User Rating</h3>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  4.8/5
                </div>
                <p className="text-sm text-gray-400">
                  Average user satisfaction
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative py-12 px-6 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-400 mb-4">
              Report generated on{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div className="flex justify-center gap-6">
              <button className="text-gray-400 hover:text-blue-400 transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-blue-400 transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
};

export default ReportPage;
