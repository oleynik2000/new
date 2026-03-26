import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "AnonBoard — Anonymous Reviews Platform",
  description:
    "Anonymous reviews on anything. Share honest opinions about people, companies, products, and more without revealing your identity.",
  keywords: "anonymous, reviews, opinions, platform, community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
