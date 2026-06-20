import type { Metadata } from 'next';
import { Cinzel_Decorative, Press_Start_2P, Share_Tech_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

const cinzel = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-cinzel',
  display: 'swap',
});

const pressStart = Press_Start_2P({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-press-start',
  display: 'swap',
});

const shareTech = Share_Tech_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-share-tech',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SLG Hub',
  description: 'Soul Lab Gym — GoHighLevel Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${pressStart.variable} ${shareTech.variable}`}
    >
      <body
        className="min-h-screen bg-[#080810] text-white scanlines"
        style={{ fontFamily: 'var(--font-share-tech), monospace' }}
      >
        <div className="crt-vignette" />
        <Header />
        <main className="pb-24">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
