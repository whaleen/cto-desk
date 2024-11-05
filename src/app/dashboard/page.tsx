// src/app/dashboard/page.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { WalletButton } from '@/components/WalletButton';

interface Site {
  id: string;
  name: string;
  subdomain: string | null;
  customDomain: string | null;
}

export default function Dashboard() {
  const { connected, publicKey } = useWallet();
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      checkAccess();
    }
  }, [connected, publicKey]);

  const checkAccess = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: publicKey?.toString()
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to verify access');
      }

      const data = await res.json();
      console.log('Access check response:', data);

      // User is whitelisted if either isActive or has a whitelist record
      setIsWhitelisted(data.isActive);

      if (data.isActive) {
        // Fetch sites if user is whitelisted
        const sitesRes = await fetch('/api/sites');
        const sitesData = await sitesRes.json();
        setSites(sitesData.sites);
      }
    } catch (err) {
      console.error('Error checking access:', err);
      setError(err instanceof Error ? err.message : 'Failed to check access');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-2xl font-bold mb-4">Connect your wallet to continue</h1>
        <WalletButton />
      </div>
    );
  }

  if (!isWhitelisted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-2xl font-bold mb-4">Your wallet is not whitelisted</h1>
        <p className="mb-4">Wallet: {publicKey?.toString()}</p>
        <WalletButton />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Dashboard</h1>
          <WalletButton />
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Create New Site</h2>
              <p>Start building your new site</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Create Site</button>
              </div>
            </div>
          </div>

          {sites.map((site) => (
            <div key={site.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{site.name}</h2>
                {site.subdomain && (
                  <p>{site.subdomain}.yourdomain.com</p>
                )}
                {site.customDomain && (
                  <p>{site.customDomain}</p>
                )}
                <div className="card-actions justify-end">
                  <button className="btn btn-outline btn-sm">Edit</button>
                  <button className="btn btn-primary btn-sm">View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
