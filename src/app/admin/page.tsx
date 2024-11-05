// src/app/admin/page.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { WalletButton } from '@/components/WalletButton';

interface User {
  id: string;
  wallet: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const { connected, publicKey, connecting, wallet } = useWallet();
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only proceed if wallet is initialized and connected
    if (!connecting && connected && publicKey && wallet) {
      checkAdminAndLoadUsers();
    } else if (!connecting) {
      // If not connecting and not connected, we can stop loading
      setLoading(false);
    }
  }, [connected, publicKey, connecting, wallet]);

  const checkAdminAndLoadUsers = async () => {
    if (!publicKey) return; // Extra safety check

    try {
      setLoading(true);
      const res = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: publicKey.toString() }),
      });

      if (!res.ok) throw new Error('Failed to check admin status');

      const data = await res.json();
      console.log('Admin check response:', data);

      setIsAdmin(data.isAdmin);

      if (data.isAdmin) {
        const usersRes = await fetch('/api/admin/users');
        if (!usersRes.ok) throw new Error('Failed to fetch users');

        const usersData = await usersRes.json();
        setUsers(usersData.users);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state when connecting
  if (connecting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4">Connecting wallet...</p>
      </div>
    );
  }

  // Show loading state when checking admin status
  if (loading && connected) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4">Checking permissions...</p>
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
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <p className="mb-4">This wallet does not have admin privileges.</p>
        <WalletButton />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin</h1>
        <WalletButton />
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          {error}
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
                    className={`px-2 py-1 rounded text-sm ${user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {user.isActive ? 'Whitelisted' : 'Not Whitelisted'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => toggleWhitelist(user.wallet)}
                    className={`btn btn-sm ${user.isActive ? 'btn-error' : 'btn-success'
                      }`}
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
