'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState, useCallback } from 'react';
import { WalletButton } from '@/components/WalletButton';
import { useWalletStore } from '@/stores/useWalletStore';
import { useWalletRefresh } from '@/stores/useWalletRefresh';

interface User {
  id: string;
  wallet: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const { connected } = useWallet();
  const {
    isAdmin,
    currentAddress,
    error: walletError,
    userDataLoading,
    refreshAll
  } = useWalletStore();
  const lastUpdate = useWalletRefresh((state) => state.lastUpdate);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (mounted = true) => {
    if (!connected || !currentAddress || !isAdmin) {
      if (mounted) setLoading(false);
      return;
    }

    try {
      if (mounted) setLoading(true);
      setError(null);

      // First refresh wallet store data (keep this!)
      await refreshAll();

      // Then fetch admin-specific data
      const usersRes = await fetch('/api/admin/users', {
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': currentAddress
        }
      });

      if (!usersRes.ok) throw new Error('Failed to fetch users');

      const usersData = await usersRes.json();
      if (mounted) setUsers(usersData.users);
    } catch (err) {
      console.error('Error:', err);
      if (mounted) setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (mounted) setLoading(false);
    }
  }, [connected, currentAddress, isAdmin, refreshAll]);

  // Combined effect for initial load and wallet changes
  useEffect(() => {
    let mounted = true;
    console.log('Admin dashboard effect triggered:', { lastUpdate, currentAddress, connected, isAdmin });

    if (connected && currentAddress && isAdmin) {
      loadData(mounted);
    }

    return () => {
      mounted = false;
    };
  }, [loadData, lastUpdate, connected, currentAddress, isAdmin]);

  const toggleWhitelist = async (wallet: string) => {
    if (!currentAddress) return;

    try {
      setError(null);
      const res = await fetch('/api/admin/whitelist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': currentAddress
        },
        body: JSON.stringify({ wallet }),
      });

      if (!res.ok) throw new Error('Failed to update whitelist status');

      loadData();
    } catch (err) {
      console.error('Error toggling whitelist:', err);
      setError(err instanceof Error ? err.message : 'Failed to update whitelist');
    }
  };

  // Show loading state when loading user data
  if (userDataLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4">Loading...</p>
      </div>
    );
  }

  // Show connect wallet prompt
  if (!connected) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-2xl font-bold mb-4">Connect your wallet to continue</h1>
        <WalletButton />
      </div>
    );
  }

  // Show loading state only when actively loading users as an admin
  if (loading && connected && isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4">Loading users...</p>
      </div>
    );
  }

  // Show no access message
  if (!isAdmin) {
    return (
      <>
        <div className="hero min-h-screen">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
              <div className="alert alert-warning mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>Admin access required</span>

              </div>
              <WalletButton />
            </div>
          </div>
        </div>

      </>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin</h1>
      </div>

      {(error || walletError) && (
        <div className="alert alert-error mb-4">
          <span>{error || walletError}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Wallet</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="font-mono text-sm">
                  {user.wallet.slice(0, 4)}...{user.wallet.slice(-4)}
                </td>
                <td>
                  <span
                    className={`badge ${user.isActive ? 'badge-success' : 'badge-error'}`}
                  >
                    {user.isActive ? 'Whitelisted' : 'Not Whitelisted'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => toggleWhitelist(user.wallet)}
                    className={`btn btn-sm ${user.isActive ? 'btn-error' : 'btn-success'}`}
                  >
                    {user.isActive ? 'Remove' : 'Whitelist'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

