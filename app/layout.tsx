import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ziang Li | Fullstack Developer",
  description:
    "Ziang Li builds backend, AI, and fullstack systems with careful product craft.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
