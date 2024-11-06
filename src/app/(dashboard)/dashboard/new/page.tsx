// src/app/dashboard/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { getBaseUrl, isReservedPath } from '@/lib/domain';

interface UserData {
  id: string;
  creditBalance: number;
}

export default function NewSite() {

  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Fetch user data including credit balance
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ wallet: window.solana?.publicKey?.toString() }),
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const data = await response.json();
        setUserData(data.user);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    if (connected) {
      fetchUserData();
    }
  }, [connected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'subdomain') {
      const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '-');

      if (isReservedPath(sanitized)) {
        setError('This name is reserved and cannot be used');
      } else {
        setError(null);
      }

      setFormData(prev => ({ ...prev, [name]: sanitized }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!publicKey) {
      setError('Wallet not connected');
      setLoading(false);
      return;
    }

    // Credit check
    if (!userData || userData.creditBalance <= 0) {
      setError('You need at least 1 credit to create a new site');
      setLoading(false);
      return;
    }

    // Additional validation before submission
    if (isReservedPath(formData.subdomain)) {
      setError('This name is reserved and cannot be used');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/sites/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': publicKey.toString(),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create site');
      }

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'toast toast-end';
      successMessage.innerHTML = `
        <div class="alert alert-success">
          <span>Site created successfully! New credit balance: ${data.newBalance}</span>
        </div>
      `;
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);

      // Navigate back to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create site');
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold mb-4">Connect your wallet to continue</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Create New Site</h2>

          {/* Credit Balance Information */}
          <div className="mb-4">
            <div className="flex items-center justify-between p-4 bg-base-300 rounded-lg">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <span>Available Credits:</span>
              </div>
              <span className="text-xl font-bold">{userData?.creditBalance ?? 0}</span>
            </div>
            <p className="text-sm mt-2 text-base-content/70">Creating a new site requires 1 credit</p>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Site Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="My Awesome Site"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Site URL</span>
              </label>
              <div className="flex items-center">
                <div className="input input-bordered bg-base-300 flex-none px-3 flex items-center h-12">
                  {getBaseUrl()}/
                </div>
                <input
                  type="text"
                  name="subdomain"
                  value={formData.subdomain}
                  onChange={handleInputChange}
                  className="input input-bordered flex-1 rounded-l-none"
                  placeholder="my-site"
                  required
                />
              </div>
              <label className="label">
                <span className="label-text-alt">
                  Only lowercase letters, numbers, and hyphens. Cannot use reserved words.
                </span>
              </label>
            </div>

            {formData.subdomain && (
              <div className="text-sm opacity-70 font-mono bg-base-300 p-2 rounded">
                Full URL: {getBaseUrl()}/{formData.subdomain}
              </div>
            )}

            <div className="card-actions justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading || (userData?.creditBalance ?? 0) <= 0}
              >
                Create Site
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
