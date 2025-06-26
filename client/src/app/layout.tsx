import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
