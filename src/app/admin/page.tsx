
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
  const { connected, publicKey } = useWallet();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!connected || !publicKey) return;

    fetchUsers();
  }, [connected, publicKey]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      setError('Error fetching users');
      console.error(err);
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

      if (!res.ok) throw new Error('Failed to update whitelist');
      await fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Error updating whitelist');
      console.error(err);
    }
  };

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <WalletButton />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <WalletButton />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Wallet</th>
                <th>Created At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="font-mono">{user.wallet.slice(0, 4)}...{user.wallet.slice(-4)}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`px-2 py-1 rounded ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.isActive ? 'Whitelisted' : 'Not Whitelisted'}
                    </span>
                  </td>
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
      )}
    </div>
  );
}



