import ProtectedRoute from "@/components/general/ProtectedRoute";

const ContributePage = () => {
  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Contribute Page</h1>
        <p className="text-lg">This page is under construction.</p>
      </div>
    </ProtectedRoute>
  );
};

export default ContributePage;
