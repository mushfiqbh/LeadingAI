import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToasterProvider } from "@/context/ToasterContext";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/general/Header";

export const metadata: Metadata = {
  title: "Zen AI Agent",
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
          <ToasterProvider>
            <Header />
            <main className="w-full min-h-[calc(100dvh-70px)] mt-[70px] bg-white text-black/80">
              {children}
            </main>
          </ToasterProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
