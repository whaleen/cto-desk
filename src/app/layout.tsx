// src/app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { WalletProviders } from '@/providers/WalletProvider';
import "./globals.css";
import { StrictMode } from 'react';
import { Suspense } from 'react';
import Loading from './loading';
import Navbar from '@/components/Navbar';
import './wallet-modal.css';

const firaCode = localFont({
  src: "./fonts/FiraCode-Light.woff2",
  variable: "--font-fira-code",
  weight: "400",
});

export const metadata: Metadata = {
  title: "NIL Sites",
  description: "from @nothingdao",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${firaCode.variable} antialiased min-h-screen`}>
        <StrictMode>
          <WalletProviders>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow">
                <Suspense fallback={<Loading />}>
                  {children}
                </Suspense>
              </div>
            </div>
          </WalletProviders>
        </StrictMode>
      </body>
    </html>
  );
}
