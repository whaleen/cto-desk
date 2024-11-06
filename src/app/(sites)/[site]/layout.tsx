// src/app/(sites)/[site]/layout.tsx
import { Suspense } from 'react';
import Loading from '../../loading';
import localFont from "next/font/local";

const firaCode = localFont({
  src: "../../fonts/FiraCode-Light.woff2",
  variable: "--font-fira-code",
  weight: "400",
});

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${firaCode.variable} antialiased min-h-screen`}>
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
