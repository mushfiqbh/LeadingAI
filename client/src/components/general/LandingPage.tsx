const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to LucidAI</h1>
      <p className="text-lg mb-8">
        Your AI-powered assistant for all your needs.
      </p>
      <a
        href="/chat"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Start Chatting
      </a>
    </div>
  );
};

export default LandingPage;
