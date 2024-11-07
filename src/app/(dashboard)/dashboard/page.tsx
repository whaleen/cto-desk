// src/app/(dashboard)/dashboard/page.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { WalletButton } from '@/components/WalletButton';
import { useWalletStore } from '@/stores/useWalletStore';
import { useWalletRefresh } from '@/stores/useWalletRefresh';
import Link from 'next/link';
import PurchaseCredits from '@/components/PurchaseCredits';

export default function Dashboard() {
  const { connected } = useWallet();
  const {
    currentAddress,
    userData,
    sites,
    isWhitelisted,
    sitesLoading,
    userDataLoading,
    error,
    refreshAll
  } = useWalletStore();
  const lastUpdate = useWalletRefresh((state) => state.lastUpdate);

  const loading = sitesLoading || userDataLoading;

  // Combined effect for initial load and wallet changes
  useEffect(() => {
    console.log('Dashboard effect triggered:', { lastUpdate, currentAddress, connected });

    if (connected && currentAddress) {
      refreshAll();
    }
  }, [lastUpdate, connected, currentAddress, refreshAll]);

  if (loading) {
    return (
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold mb-4">Connect your wallet to continue</h1>
            <WalletButton />
          </div>
        </div>
      </div>
    );
  }

  if (!isWhitelisted) {
    return (
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold mb-4">Access Required</h1>
            <div className="alert alert-warning mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>Your wallet is not whitelisted</span>
            </div>
            <div className="text-sm font-mono mb-4 opacity-60">
              {currentAddress}
            </div>
            <WalletButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">

      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}

      {userData?.isAdmin && (
        <Link href="/admin">
          <span className="btn btn-xs badge-primary">
            Admin
          </span>
        </Link>
      )}

      {/* Add transition animations to user stats */}
      {userData && (
        <div className="stats shadow w-full mb-8 animate-in fade-in duration-300">
          <div className="stat flex items-center">
            <div className="avatar mr-4">
              <div className="w-16 rounded-full bg-neutral-focus text-neutral-content">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <div>
              <div className="stat-title">Wallet</div>
              <div className="stat-value text-sm font-mono">
                {userData.wallet.slice(0, 4)}...{userData.wallet.slice(-4)}
              </div>
              <div className="stat-desc">Member since {new Date(userData.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Status</div>
            <div className="stat-value">
              <div className="flex gap-2">
                <div className="badge badge-success">Active</div>
                {userData.isAdmin && (
                  <div className="badge badge-primary">Admin</div>
                )}
              </div>
            </div>
            <div className="stat-desc">
              {userData.isAdmin ? 'Administrator account' : 'Whitelisted account'}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Sites</div>
            <div className="stat-value">{sites.length}</div>
            <div className="stat-desc">{sites.length === 0 ? 'Create your first site' : 'Active sites'}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Available Credits</div>
            <div className="stat-value">
              {userData.creditBalance}
            </div>
            <div className="stat-desc">
              {userData.creditBalance === 0 ? (
                <span className="text-error">No credits available</span>
              ) : (
                `Credits for new sites`
              )}
            </div>
          </div>
        </div>
      )}

      {userData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Available Credits</div>
              <div className="stat-value">{userData.creditBalance}</div>
              <div className="stat-desc">
                {userData.creditBalance === 0 ? (
                  <span className="text-error">No credits available</span>
                ) : (
                  `Credits for new sites`
                )}
              </div>
            </div>
          </div>
          <PurchaseCredits onSuccess={() => {
            refreshAll();
          }} />
        </div>
      )}


      {/* Sites Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Create New Site Card */}
        <div className="card bg-base-400 card-bordered">
          <div className="card-body">
            <h2 className="card-title">Create New Site</h2>
            <p>Start building your new presence</p>
            {userData && userData.creditBalance > 0 ? (
              <div className="text-sm opacity-70">
                Uses 1 credit to deploy
              </div>
            ) : (
              <div className="text-sm text-error">
                No credits available
              </div>
            )}
            <div className="card-actions justify-end">
              <Link href="/dashboard/new">
                <button
                  className="btn btn-primary"
                  disabled={!userData || userData.creditBalance === 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Create Site
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Existing Sites */}
        {sites.map((site) => (
          <div key={site.id} className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{site.name}</h2>
              {site.subdomain && (
                <div className="badge badge-outline">nil.computer/{site.subdomain}</div>
              )}
              {site.customDomain && (
                <div className="badge badge-secondary">{site.customDomain}</div>
              )}
              <div className="card-actions justify-end">

                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    // Force a full page navigation instead of client-side
                    window.location.href = `/sites/${site.id}/edit`
                  }}
                >
                  Edit
                </button>
                <Link href={`/${site.subdomain}`} target='_blank'>
                  <span className="btn btn-primary btn-sm">View</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
