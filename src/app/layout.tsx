import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "FoundHub — Toshkentda topilgan va yo'qolgan buyumlar",
  description: "Toshkentda tushirib qoldirilgan yoki topib olingan buyumlar xizmati. E'lon berish, xavfsiz tekshirish va egasiga qaytarish tarmog'i.",
  metadataBase: new URL('https://foundhub-alpha.vercel.app'),
  alternates: {
    canonical: 'https://foundhub-alpha.vercel.app/',
    languages: {
      uz: 'https://foundhub-alpha.vercel.app/?lang=uz',
      ru: 'https://foundhub-alpha.vercel.app/?lang=ru',
      en: 'https://foundhub-alpha.vercel.app/?lang=en',
      'x-default': 'https://foundhub-alpha.vercel.app/',
    },
  },
  openGraph: {
    title: "FoundHub — Toshkentda topilgan va yo'qolgan buyumlar",
    description: "Toshkentda tushirib qoldirilgan yoki topib olingan buyumlar xizmati. E'lon berish, xavfsiz tekshirish va egasiga qaytarish tarmog'i.",
    url: 'https://foundhub-alpha.vercel.app/',
    siteName: 'FoundHub',
    images: [
      {
        url: 'https://foundhub-alpha.vercel.app/icon.svg',
        width: 512,
        height: 512,
        alt: 'FoundHub — Toshkentda topilgan va yo\'qolgan buyumlar',
      },
    ],
    locale: 'uz_UZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "FoundHub — Toshkentda topilgan va yo'qolgan buyumlar",
    description: "Toshkentda tushirib qoldirilgan yoki topib olingan buyumlar xizmati. E'lon berish, xavfsiz tekshirish va egasiga qaytarish tarmog'i.",
    images: ['https://foundhub-alpha.vercel.app/icon.svg'],
  },
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
    <html lang="uz" className="h-full bg-[#090a0f] text-zinc-100 antialiased selection:bg-emerald-500 selection:text-black">
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
