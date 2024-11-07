// src/app/(sites)/[site]/layout.tsx
import { Suspense } from 'react';
import Loading from '../../loading';
import localFont from "next/font/local";
import SiteNavbar from '@/components/SiteNavbar';
import { WalletProviders } from '@/providers/WalletProvider';
import { StrictMode } from 'react';
import type { Metadata } from "next";

const firaCode = localFont({
  src: "../../fonts/FiraCode-Light.woff2",
  variable: "--font-fira-code",
  weight: "400",
});

export const metadata: Metadata = {
  title: "NIL Sites",
  description: "View NIL Sites",
};

export default function SiteLayout({
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
              <SiteNavbar />
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
