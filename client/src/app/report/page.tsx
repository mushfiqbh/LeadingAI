import ProtectedRoute from "@/components/general/ProtectedRoute";

const ReportPage = () => {
  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Report Page</h1>
        <p className="text-lg">This page is under construction.</p>
      </div>
    </ProtectedRoute>
  );
};

export default ReportPage;
