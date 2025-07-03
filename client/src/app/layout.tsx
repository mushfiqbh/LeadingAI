import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/general/Header";

export const metadata: Metadata = {
  title: "Leading AI Agent",
  description: "Agentic AI for Leading University Students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main className="w-full min-h-[calc(100dvh-80px)] mt-[80px] bg-white text-black/80">
            {children}
          </main>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
