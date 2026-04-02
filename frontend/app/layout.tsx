import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import BottomNav from '@/components/layout/BottomNav';
import TopNav from '@/components/layout/TopNav';

export const metadata: Metadata = {
  title: 'DADAJ BIRYANI – Premium Biryani Experience',
  description: 'Order the finest biryanis crafted with royal Dum-pukht tradition. Authentic flavors delivered fresh to your door.',
  keywords: 'biryani, dadaj biryani, premium biryani, order biryani online',
  openGraph: {
    title: 'DADAJ BIRYANI',
    description: 'Premium Biryani Experience – Order Now',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="bg-brand-cream font-body antialiased">
        <TopNav />
        <main className="min-h-screen pb-20 md:pb-0">
          {children}
        </main>
        <BottomNav />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#fff',
              color: '#1a1a1a',
              borderRadius: '12px',
              border: '1px solid #fed7aa',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
