// src/providers/WalletProvider.tsx
'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import dynamic from 'next/dynamic';
import { type FC, type ReactNode } from 'react';

require('@solana/wallet-adapter-react-ui/styles.css');

// Create a wrapper component that's dynamically imported
const WalletProviderComponent: FC<{ children: ReactNode }> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

// Export a dynamic version of the wrapper that's only rendered client-side
export const WalletProviders = dynamic(
  () => Promise.resolve(WalletProviderComponent),
  {
    ssr: false,
    loading: () => <div>Loading wallet integration...</div>
  }
);
