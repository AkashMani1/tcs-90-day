import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'), // Adjust to your production URL for deployment
  title: 'PlacePrep — Crack TCS Ninja, Digital & Prime in 3 Months',
  description:
    'PlacePrep is your all-in-one placement preparation command center for TCS Ninja, Digital, and Prime roles. Track DSA problems, mock interviews, STAR stories, and your 12-week roadmap — all in one place.',
  keywords: ['TCS placement', 'TCS Ninja', 'TCS Digital', 'TCS Prime', 'placement tracker', 'DSA tracker', 'campus placement'],
  openGraph: {
    title: 'PlacePrep — Crack TCS in 3 Months',
    description: 'Your TCS placement preparation command center.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
