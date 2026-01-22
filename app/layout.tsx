import './globals.css';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { AuthProvider } from '@/lib/auth/auth-context';
import { LayoutClient } from './layout-client';
import { Toaster } from '@/components/ui/toaster';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'Airbnb - Book unique homes and experiences',
  description: 'Discover amazing places to stay and things to do around the world',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <AuthProvider>
          <LayoutClient />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
