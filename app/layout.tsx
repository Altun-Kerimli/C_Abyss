import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Musician Portfolio',
  description: 'Radical Optimism through atmospheric soundscapes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Removed the hard bg-black so the layers behind can show through */}
      <body className={`${inter.className} min-h-screen flex flex-col overflow-x-hidden relative text-white`}>
        
        {/* --- PARALLAX BACKGROUND SETUP --- */}
        {/* 1. The Fixed Image Layer */}
        <div 
          className="fixed inset-0 z-[-2] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/rock group.png')" }} // <-- UPDATE THIS TO YOUR EXACT FILE NAME
        />
        {/* 2. The Dark Overlay (Adjust bg-black/70 to make it lighter/darker) */}
        <div className="fixed inset-0 z-[-1] bg-black/70" /> 
        {/* --------------------------------- */}

        {/* GLOBAL NAVBAR (Added glass effect: backdrop-blur-md bg-black/30) */}
        <header className="border-b border-gray-800/50 p-4 backdrop-blur-md bg-black/30">
          <nav className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            <Link href="/" className="text-xl font-bold tracking-widest text-blue-400">
              ARTIST LOGO
            </Link>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
              <Link href="/announcements" className="hover:text-violet-400">Announcements</Link>
              <Link href="/albums" className="hover:text-violet-400">Albums</Link>
              <Link href="/gallery" className="hover:text-violet-400">Gallery</Link>
              <Link href="/contact" className="hover:text-violet-400">Contact</Link>
            </div>
          </nav>
        </header>

        {/* MAIN PAGE CONTENT */}
        <main className="flex-grow max-w-6xl mx-auto w-full p-4 relative">
          {children}
        </main>

        {/* GLOBAL FOOTER (Added glass effect) */}
        <footer className="border-t border-gray-800/50 p-6 text-center text-sm text-gray-500 backdrop-blur-md bg-black/30">
          <p>© 2026 Artist Name. All rights reserved.</p>
          <p>Footer text here</p>
        </footer>

      </body>
    </html>
  );
}