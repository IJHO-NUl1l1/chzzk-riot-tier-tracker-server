import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chzzk LoL Tier Server",
  description: "A simple API server for retrieving League of Legends player information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
      >
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="py-6 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Chzzk LoL Tier Server. Not affiliated with Riot Games.</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
