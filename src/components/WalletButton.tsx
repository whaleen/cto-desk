// src/components/WalletButton.tsx
'use client';

import { useWallet, type WalletContextState } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the button with no SSR
const WalletMultiButtonDynamic = dynamic(
  () => Promise.resolve(WalletMultiButton),
  { ssr: false }
);

export function WalletButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <button className="btn">Connect Wallet</button>;
  }

  return (
    <div>
      <WalletMultiButtonDynamic className="btn" />
    </div>
  );
}

// Create a separate component for wallet-dependent functionality
export function WalletConnectionHandler() {
  const { connected, publicKey } = useWallet();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      handleConnection();
    }
  }, [connected, publicKey]);

  const handleConnection = async () => {
    try {
      const authRes = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: publicKey?.toString(),
        }),
      });

      if (!authRes.ok) throw new Error('Auth failed');

      const checkRes = await fetch('/api/auth/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: publicKey?.toString(),
        }),
      });

      if (!checkRes.ok) throw new Error('Status check failed');

      const data = await checkRes.json();
      console.log('Auth status:', data);
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  };

  if (!connected || !publicKey) return null;

  return error ? (
    <div className="text-red-500 text-sm mt-2">
      Error: {error}
    </div>
  ) : null;
}

// Combined component
export function WalletConnector() {
  return (
    <div>
      <WalletButton />
      <WalletConnectionHandler />
    </div>
  );
}
