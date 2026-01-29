import FrontPageForm from "@/components/frontpage/FrontPageForm";
import Header from "@/components/general/Header";

export default function FrontPage() {
  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <Header />
      <div className="py-12">
        <FrontPageForm />
      </div>
    </div>
  );
}
