// src/providers/WalletProvider.tsx
'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import dynamic from 'next/dynamic';
import { type FC, type ReactNode, useMemo } from 'react';

require('@solana/wallet-adapter-react-ui/styles.css');

// Create a wrapper component that's dynamically imported
const WalletProviderComponent: FC<{ children: ReactNode }> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Add explicit connection config
  const config = useMemo(() => ({
    commitment: 'confirmed',
    wsEndpoint: endpoint.replace('https', 'wss'),
    preflightCommitment: 'confirmed',
  }), [endpoint]);

  return (
    <ConnectionProvider endpoint={endpoint} config={config}>
      <WalletProvider
        wallets={[]}
        autoConnect
        onError={(error) => {
          console.error('Wallet error:', error);
        }}
      >
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
    loading: () => (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }
);
