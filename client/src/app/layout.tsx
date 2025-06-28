import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";

export const metadata: Metadata = {
  title: " AI Agent",
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
    </html>
  );
}
