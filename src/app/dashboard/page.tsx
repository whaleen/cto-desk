// src/app/dashboard/page.tsx - Let's update the check function
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { WalletButton } from '@/components/WalletButton';

export default function Dashboard() {
  const { connected, publicKey } = useWallet();
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      checkWhitelistStatus();
    }
  }, [connected, publicKey]);

  const checkWhitelistStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: publicKey?.toString() }),
      });

      if (!res.ok) {
        throw new Error('Failed to check whitelist status');
      }

      const data = await res.json();
      console.log('Whitelist check response:', data); // Debug log
      setIsWhitelisted(data.isActive || data.isWhitelisted);
    } catch (err) {
      console.error('Error checking whitelist:', err);
      setError('Failed to check whitelist status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
        <WalletButton />
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Connect your wallet to continue</h1>
        <WalletButton />
      </div>
    );
  }

  if (!isWhitelisted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Your wallet is not whitelisted</h1>
        <p>Wallet address: {publicKey?.toString()}</p>
        <p className="mt-4">Please contact the administrator for access.</p>
        <WalletButton />
      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Sites</h1>
        <div className="flex gap-4">
          <WalletButton />
          <button
            onClick={() => router.push('/dashboard/new')}
            className="btn btn-primary"
          >
            Create New Site
          </button>
        </div>
      </div>

      {sites.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl mb-4">You haven't created any sites yet</h2>
          <button
            onClick={() => router.push('/dashboard/new')}
            className="btn btn-primary"
          >
            Create Your First Site
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <div key={site.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{site.name}</h2>
                <p className="text-sm opacity-70">
                  {site.subdomain}.yourdomain.com
                </p>
                {site.customDomain && (
                  <p className="text-sm opacity-70">{site.customDomain}</p>
                )}
                <div className="card-actions justify-end mt-4">
                  <button
                    onClick={() => router.push(`/dashboard/sites/${site.id}`)}
                    className="btn btn-primary btn-sm"
                  >
                    Manage
                  </button>
                  <a
                    href={`https://${site.subdomain}.yourdomain.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                  >
                    Visit
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
