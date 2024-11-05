// src/components/WalletButton.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

export function WalletButton() {
  const { connected, publicKey } = useWallet();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      handleConnection();
    }
  }, [connected, publicKey]);

  const handleConnection = async () => {
    try {
      // First create/update user
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

      // Then check status
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

  return (
    <div>
      <WalletMultiButton className="btn" />
      {error && (
        <div className="text-red-500 text-sm mt-2">
          Error: {error}
        </div>
      )}
    </div>
  );
}
