export default function Landing({
  setShowLanding,
}: {
  setShowLanding: (show: boolean) => void;
}) {
  return (
    <div className="bg-white px-4 text-center">
      <div className="max-w-2xl mx-auto py-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to Leading AI Agent</h1>
        <p className="text-lg text-gray-600 mb-8">
          Agentic AI platform for leading university students. Collaborate,
          explore, and grow.
        </p>
        <button
          onClick={() => setShowLanding(false)}
          className="px-6 py-3 cursor-pointer bg-black text-white rounded-xl hover:bg-gray-800 transition"
        >
          Start Chat
        </button>
      </div>

      <div className="max-w-2xl mx-auto py-16">
        <h2 className="text-3xl font-semibold mb-6">Features</h2>
        <ul className="list-disc list-inside text-left space-y-4">
          <li>Collaborative AI agents for group projects</li>
          <li>Advanced AI tools for research and learning</li>
          <li>Seamless integration with university resources</li>
          <li>Community-driven knowledge sharing</li>
        </ul>
        <p className="mt-6 text-gray-600">
          Join us in revolutionizing the way students collaborate and learn
          using AI.
        </p>
      </div>

      <div className="max-w-2xl mx-auto py-16">
        <h2 className="text-3xl font-semibold mb-6">Get Started</h2>
        <p className="text-lg text-gray-600 mb-4">
          Ready to enhance your university experience with AI? Click the button
          below to start using Leading AI Agent.
        </p>
        <button
          onClick={() => setShowLanding(false)}
          className="px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Start Now
        </button>
      </div>

      <div className="py-8 text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} Leading AI Agent. All rights
          reserved.
        </p>

        <p>
          Made with <span className="text-red-500">♥</span> Github Copilot
        </p>
      </div>
    </div>
  );
}
