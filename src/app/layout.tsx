import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_NAME, SUPPORT_EMAIL } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${APP_NAME} — AI Dating Profile Photo Makeover`,
  description:
    "Upload your selfies and get 100 professional AI dating profile photos. Powered by Higgsfield Soul 2.0.",
  openGraph: {
    title: APP_NAME,
    description: "Transform your dating profile with AI-generated photos that look like you.",
    type: "website",
  },
  other: {
    "support-email": SUPPORT_EMAIL,
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
