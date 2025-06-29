import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Leading AI Agent",
  description: "Agentic AI for Leading University Students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
      <Analytics />
    </html>
  );
}
