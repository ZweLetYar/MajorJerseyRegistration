import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "IST Jacket Registration",
    template: "%s | IST Jacket Registration",
  },
  description: "Student registration system",
  keywords: ["registration", "students", "nextjs", "Jacket"],
  authors: [{ name: "Zwe Let Yar" }],
  openGraph: {
    title: "IST Jacket Registration",
    description: "Student registration system",
    url: "https://yourdomain.com",
    siteName: "IST System",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IST Jacket Registration",
    description: "Student registration system",
  },
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex justify-center px-4 py-3">{children}</main>
      </body>
    </html>
  );
}
