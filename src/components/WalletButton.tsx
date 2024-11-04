// src/components/WalletButton.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function WalletButton() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="flex flex-col items-center gap-4">
      <WalletMultiButton className="btn" />
      {connected && (
        <span className="text-sm opacity-50">
          Connected: {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
        </span>
      )}
    </div>
  );
}
