// src/app/(dashboard)/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { WalletProviders } from '@/providers/WalletProvider';
import "../globals.css";
import { StrictMode } from 'react';
import ThemeController from '@/components/ThemeController';
import { WalletButton } from '@/components/WalletButton';
import '../wallet-modal.css';
import { Suspense } from 'react';
import Loading from '../loading';
import Link from 'next/link';

const firaCode = localFont({
  src: "../fonts/FiraCode-Light.woff2",
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


              <div className="navbar bg-base-200/50 backdrop-blur supports-[backdrop-filter]:bg-base-200/50 sticky top-0 z-50">
                <div className="navbar-start">
                  <div className="dropdown lg:hidden">
                    <div tabIndex={0} role="button" className="btn btn-ghost">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                      </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
                      <li><Link href="/dashboard" className="font-medium">Dashboard</Link></li>
                    </ul>
                  </div>
                  <Link href="/" className="btn btn-ghost text-xl font-bold">Sites</Link>
                </div>

                <div className="navbar-center hidden lg:flex">
                  <ul className="menu menu-horizontal px-1">
                    <li><Link href="/dashboard" className="font-medium">Dashboard</Link></li>
                  </ul>
                </div>

                <div className="navbar-end gap-2">
                  <ThemeController />
                  <WalletButton />
                </div>
              </div>

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
