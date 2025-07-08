import ProtectedRoute from "@/components/general/ProtectedRoute";

export default function ContributeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="w-full min-h-[calc(100dvh-70px)] mt-[70px]">
        {children}

        {/* Help Section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              🤝 Need Help?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              If you&apos;re having trouble contributing or need assistance with
              any form, feel free to reach out to our support team or check our
              contribution guidelines.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-gray-200 font-medium">
                📖 View Guidelines
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium">
                💬 Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
