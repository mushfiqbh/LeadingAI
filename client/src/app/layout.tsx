import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "AI Agent",
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
            <main className="w-full bg-white text-black/80">
              {children}
            </main>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
