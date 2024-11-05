// src/components/WalletButton.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect } from 'react';

export function WalletButton() {
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    if (connected && publicKey) {
      // Create user when wallet connects
      fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: publicKey.toString(),
        }),
      });
    }
  }, [connected, publicKey]);

  return <WalletMultiButton className="btn btn-primary" />;
}
