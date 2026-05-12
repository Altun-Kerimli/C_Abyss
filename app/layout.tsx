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
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        
        {/* GLOBAL NAVBAR */}
        <header className="border-b border-gray-800 p-4">
          <nav className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold tracking-widest text-blue-400">
              ARTIST LOGO
            </Link>
            <div className="space-x-6 text-sm">
              <Link href="/announcements" className="hover:text-violet-400">Announcements</Link>
              <Link href="/albums" className="hover:text-violet-400">Albums</Link>
              <Link href="/gallery" className="hover:text-violet-400">Gallery</Link>
              <Link href="/contact" className="hover:text-violet-400">Contact</Link>
            </div>
          </nav>
        </header>

        {/* MAIN PAGE CONTENT */}
        <main className="flex-grow max-w-6xl mx-auto w-full p-4">
          {children}
        </main>

        {/* GLOBAL FOOTER */}
        <footer className="border-t border-gray-800 p-6 text-center text-sm text-gray-500">
          <p>© 2026 Artist Name. All rights reserved.</p>
          {/* Secret admin link placed discreetly in the footer */}
          <p>Footer text here</p>
          {/* <Link href="/admin" className="mt-2 inline-block opacity-20 hover:opacity-100 transition-opacity">
            Admin Login
          </Link> */}
        </footer>

      </body>
    </html>
  );
}