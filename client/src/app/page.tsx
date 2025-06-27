import { Chat } from "@/components/Chat";
import Header from "@/components/sub/Header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-[72px]">
        <Chat />
      </main>
    </div>
  );
}
