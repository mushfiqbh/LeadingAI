import Link from "next/link";

export default function Landing({
  setShowLanding,
}: {
  setShowLanding: (show: boolean) => void;
}) {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Leading AI
            </h1>
            <div className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
              Smart Assistant for Leading University
            </div>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Your intelligent companion for academic success. Get instant
              results, stay updated with notices, and organize your university
              life with AI-powered assistance.
            </p>
            <button
              onClick={() => setShowLanding(false)}
              className="group relative inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <svg
                className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to excel in your university journey, powered
              by cutting-edge AI technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 hover:border-blue-200">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Academic Results
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Access your partial or full academic results instantly. Just
                provide your student ID and birthday.
              </p>
              <div className="mt-4 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100 hover:border-green-200">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                📢
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                University Notices
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Stay updated with the latest university announcements and
                important updates from Leading University.
              </p>
              <div className="mt-4 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100 hover:border-purple-200">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                📅
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Class Routines
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Generate personalized class schedules and exam routines based on
                your batch, section, and semester.
              </p>
              <div className="mt-4 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100 hover:border-orange-200">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                📚
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Study Resources
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Create PDF notes, organize study materials, and get help with
                course timelines and exam preparation.
              </p>
              <div className="mt-4 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Contributors Section */}
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
                  <span className="text-sm text-gray-600">Notices Posted</span>
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
                  <span className="text-sm text-gray-600">Notices Posted</span>
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
                  <span className="text-sm text-gray-600">Notices Posted</span>
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

          {/* Call to Action for Contributors */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold mb-4">
                Want to be a Top Contributor?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Share your knowledge, help fellow students, and climb the
                leaderboard! Every contribution earns you points and
                recognition.
              </p>
              <Link
                href="/contribute"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <span>Start Contributing</span>
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-5"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of Leading University students who are already
              using AI to enhance their academic journey.
            </p>
            <button
              onClick={() => setShowLanding(false)}
              className="group relative inline-flex items-center px-3 py-2 cursor-pointer font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <span className="relative z-10">Start Chatting Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
              <svg
                className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Leading AI Agent
            </h3>
            <p className="text-gray-400">
              Empowering Leading University students with intelligent assistance
            </p>
          </div>

          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">1000+</div>
              <div className="text-gray-400 text-sm">Students Helped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">24/7</div>
              <div className="text-gray-400 text-sm">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">Instant</div>
              <div className="text-gray-400 text-sm">Results</div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400 mb-2">
              &copy; {new Date().getFullYear()} Leading AI Agent. All rights
              reserved.
            </p>
            <p className="text-gray-500">
              Made with <span className="text-red-400 animate-pulse">♥</span> by
              Mushfiq R.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
