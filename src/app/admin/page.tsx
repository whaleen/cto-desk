// src/app/admin/page.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { WalletButton } from '@/components/WalletButton';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  wallet: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      checkAdmin();
    }
  }, [connected, publicKey]);

  const checkAdmin = async () => {
    const res = await fetch('/api/admin/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet: publicKey?.toString() }),
    });
    const data = await res.json();

    if (!data.isAdmin) {
      router.push('/'); // Redirect non-admins
    } else {
      setIsAdmin(true);
      fetchUsers();
    }
  };

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

  if (!isAdmin) {
    return null; // Optionally add a loading state
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <WalletButton />
      </div>

      {error && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
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
