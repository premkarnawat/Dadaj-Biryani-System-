import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import BottomNav   from '@/components/layout/BottomNav';
import TopNav      from '@/components/layout/TopNav';
import SplashScreen from '@/components/SplashScreen';

export const metadata: Metadata = {
  title: 'DADAJ BIRYANI – Premium Biryani Delivery',
  description: 'Order the finest biryanis crafted with royal Dum-pukht tradition. Authentic flavors delivered fresh to your door in Satara.',
  keywords: 'biryani, dadaj biryani, premium biryani, order biryani, Satara',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'DADAJ BIRYANI' },
  openGraph: { title: 'DADAJ BIRYANI', description: 'Premium Biryani Delivery', type: 'website', locale: 'en_IN' },
};

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-brand-cream font-body antialiased">
        <SplashScreen />
        <TopNav />
        <main className="min-h-screen pb-20 md:pb-0">{children}</main>
        <BottomNav />
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background:'#fff', color:'#1a1a1a', borderRadius:'12px', border:'1px solid #fed7aa', fontFamily:'Plus Jakarta Sans, sans-serif', fontSize:'14px' },
            success: { iconTheme:{ primary:'#f97316', secondary:'#fff' } },
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
