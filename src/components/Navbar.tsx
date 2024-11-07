'use client';

import React from 'react';
import Link from 'next/link';
import ThemeController from '@/components/ThemeController';
import { WalletButton } from '@/components/WalletButton';
import { useWalletStore } from '@/stores/useWalletStore';

export default function Navbar() {
  const { isWhitelisted, isAdmin } = useWalletStore();

  return (
    <div className="navbar bg-base-200/50 backdrop-blur supports-[backdrop-filter]:bg-base-200/50 sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
            {isWhitelisted && (
              <li><Link href="/dashboard" className="font-medium">Dashboard</Link></li>
            )}
            {isAdmin && (
              <li><Link href="/admin" className="font-medium">Admin</Link></li>
            )}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl font-bold">Sites</Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {isWhitelisted && (
            <li><Link href="/dashboard" className="font-medium">Dashboard</Link></li>
          )}
          {isAdmin && (
            <li><Link href="/admin" className="font-medium">Admin</Link></li>
          )}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <ThemeController />
        <WalletButton />
      </div>
    </div>
  );
}
