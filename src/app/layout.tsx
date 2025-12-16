import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AccountProvider } from '@/context/AccountContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'Stela AI - Affiliate Growth Platform',
  description: 'AI-powered platform to help affiliates grow their NuSkin business with insights, recommendations, and guided coaching',
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Stela AI',
    title: 'Stela AI - Affiliate Growth Platform',
    description: 'Your AI companion for NuSkin business growth',
  },
};

export const viewport: Viewport = {
  themeColor: '#003B5C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
      </head>
      <body className="font-sans antialiased bg-background-primary">
        <AccountProvider>
          {children}
        </AccountProvider>
      </body>
    </html>
  );
}

