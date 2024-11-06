// src/app/(dashboard)/admin/page.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { WalletButton } from '@/components/WalletButton';
import { useWalletStore } from '@/stores/useWalletStore';

interface User {
  id: string;
  wallet: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const { connected, publicKey, connecting, wallet } = useWallet();
  const { isAdmin } = useWalletStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only attempt to load users if we're connected and have admin rights
    if (!connecting && connected && publicKey && wallet && isAdmin) {
      loadUsers();
    } else {
      // Set loading to false in all other cases
      setLoading(false);
    }
  }, [connected, publicKey, connecting, wallet, isAdmin]);

  const loadUsers = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const usersRes = await fetch('/api/admin/users');
      if (!usersRes.ok) throw new Error('Failed to fetch users');

      const usersData = await usersRes.json();
      setUsers(usersData.users);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const toggleWhitelist = async (wallet: string) => {
    try {
      const res = await fetch('/api/admin/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet }),
      });

      if (!res.ok) throw new Error('Failed to update whitelist status');

      // Refresh user list
      loadUsers();
    } catch (err) {
      console.error('Error toggling whitelist:', err);
      setError(err instanceof Error ? err.message : 'Failed to update whitelist');
    }
  };

  // Show loading state when connecting wallet only
  if (connecting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4">Connecting wallet...</p>
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

  // Show connect wallet prompt
  if (!connected) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-2xl font-bold mb-4">Connect your wallet to continue</h1>
        <WalletButton />
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
                <span>Your wallet is not whitelisted</span>
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

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
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
