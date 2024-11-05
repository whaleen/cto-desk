import type { Metadata } from "next";
import localFont from "next/font/local";
import { WalletProviders } from '@/providers/WalletProvider';
import "./globals.css";
import { StrictMode } from 'react';


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CTO Desk",
  description: "from @nothingdao",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a href="/">Home</a> |&nbsp;
        <a href="/admin">Admin</a> |&nbsp;
        <a href="/dashboard">Dashboard</a>

        <StrictMode>
          <WalletProviders>
            {children}
          </WalletProviders>
        </StrictMode>
      </body>
    </html>
  );
}
