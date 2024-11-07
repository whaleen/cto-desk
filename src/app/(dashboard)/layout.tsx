// src/app/(dashboard)/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - NIL Sites",
  description: "Manage your NIL Sites",
};

// This layout inherits the WalletProviders from the root layout
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
