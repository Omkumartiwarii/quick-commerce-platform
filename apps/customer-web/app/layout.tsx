import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FlashDrop | 10-Minute Grocery & Daily Essentials Delivery in Noida',
  description: 'Vertically integrated, own-inventory quick commerce delivering groceries, fresh fruits, vegetables, dairy and FMCG within 10 minutes in Noida & Delhi NCR.',
  keywords: ['quick commerce', 'Noida groceries', '10 minute delivery', 'Zepto alternative', 'Blinkit alternative', 'own inventory'],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-['Plus_Jakarta_Sans',sans-serif] antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
