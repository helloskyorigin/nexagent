import type { Metadata } from 'next';
import './globals.css';
import { ClientProviders } from '@/components/providers/ClientProviders';

export const metadata: Metadata = {
  title: 'Nexorbit | AI Brain for the Digital World',
  description: 'Your AI Brain for the Digital World. Unified context, intelligence gateway, and secure action execution.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-[#000000] antialiased">
      <body suppressHydrationWarning className="h-full flex flex-col font-sans text-[#ECECF1] bg-[#000000]">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
