import ProtectedRoute from "@/components/general/ProtectedRoute";
import { Code, Github, Coffee, Zap, Heart, Star, ExternalLink, Mail } from "lucide-react";

const DeveloperPage = () => {
  const technologies = [
    { name: "Next.js", icon: "⚛️", color: "from-blue-500 to-cyan-500" },
    { name: "TypeScript", icon: "📘", color: "from-blue-600 to-blue-700" },
    { name: "Firebase", icon: "🔥", color: "from-orange-500 to-red-500" },
    { name: "OpenAI", icon: "🤖", color: "from-green-500 to-emerald-600" },
    { name: "Tailwind CSS", icon: "🎨", color: "from-cyan-500 to-blue-500" },
    { name: "Node.js", icon: "🟢", color: "from-green-600 to-green-700" }
  ];

  const features = [
    {
      title: "AI-Powered Assistance",
      description: "Intelligent responses using OpenAI's latest models",
      icon: <Zap className="w-6 h-6" />,
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "Real-time Chat",
      description: "Instant messaging with streaming responses",
      icon: <Code className="w-6 h-6" />,
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "Firebase Integration",
      description: "Secure authentication and data storage",
      icon: <Star className="w-6 h-6" />,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Modern UI/UX",
      description: "Beautiful, responsive design with smooth animations",
      icon: <Heart className="w-6 h-6" />,
      color: "from-pink-500 to-rose-500"
    }
  ];

  const stats = [
    { label: "Lines of Code", value: "10,000+", icon: "📝" },
    { label: "Components", value: "25+", icon: "⚙️" },
    { label: "Development Time", value: "3 Months", icon: "⏰" },
    { label: "Coffee Consumed", value: "∞", icon: "☕" }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-6xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Code className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Developer Portfolio</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Leading AI Agent
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                A sophisticated AI-powered platform designed to enhance the academic experience 
                for Leading University students through intelligent assistance and seamless interaction.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  View Source
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20">
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Contact Developer
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technologies Section */}
        <div className="relative py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Built with Modern Technologies
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Leveraging cutting-edge tools and frameworks for optimal performance and user experience
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
              {technologies.map((tech, index) => (
                <div key={index} className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-center">
                    <div className="text-4xl mb-3">{tech.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{tech.name}</h3>
                    <div className={`h-1 bg-gradient-to-r ${tech.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative py-20 px-6 bg-gradient-to-r from-gray-900/50 to-blue-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Key Features
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover the powerful capabilities that make this platform unique
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Developer Info Section */}
        <div className="relative py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-2xl">
                MR
              </div>
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Mushfiq Rahman
              </h3>
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                Full-stack developer passionate about creating innovative solutions that enhance educational experiences. 
                Specialized in modern web technologies and AI integration.
              </p>
              <div className="flex justify-center items-center gap-2 text-pink-400">
                <span>Made with</span>
                <Heart className="w-5 h-5 animate-pulse" />
                <span>and lots of</span>
                <Coffee className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative py-12 px-6 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-400 mb-4">
              &copy; {new Date().getFullYear()} Leading AI Agent. Crafted with passion for Leading University students.
            </p>
            <div className="flex justify-center gap-6">
              <button className="text-gray-400 hover:text-blue-400 transition-colors">
                <Github className="w-6 h-6" />
              </button>
              <button className="text-gray-400 hover:text-blue-400 transition-colors">
                <Mail className="w-6 h-6" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
};

export default DeveloperPage;
