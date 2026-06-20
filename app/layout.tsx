import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

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
    <html lang="en" className="dark">
      <body className="bg-black text-white min-h-screen">
        <Header />
        <main className="pb-24">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
