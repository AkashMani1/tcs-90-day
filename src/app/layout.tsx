import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'), // Adjust to your production URL for deployment
  title: 'PlacePrep — Crack Your Dream Job in 3 Months',
  description:
    'PlacePrep is your all-in-one placement preparation command center for Software Engineering roles. Track DSA problems, mock interviews, STAR stories, and your 12-week roadmap — all in one place.',
  keywords: ['placement prep', 'SDE prep', 'software engineering', 'placement tracker', 'DSA tracker', 'campus placement'],
  openGraph: {
    title: 'PlacePrep — Crack Your Dream Job in 3 Months',
    description: 'Your placement preparation command center.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
