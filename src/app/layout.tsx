import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'FoundHub - Community-Driven Lost and Found Platform',
  description: 'Connect finders and owners with geolocation tracking, anti-fraud proof-of-ownership verification, custody tracking, and community identification threads.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-[#090a0f] text-zinc-100 antialiased selection:bg-emerald-500 selection:text-black">
      <body className="min-h-full flex flex-col font-sans bg-[#090a0f] text-zinc-100">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
