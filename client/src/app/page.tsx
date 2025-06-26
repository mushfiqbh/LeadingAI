import { Chat } from "@/components/Chat";
import Header from "@/components/sub/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16" />
      <Chat />
    </div>
  );
}
