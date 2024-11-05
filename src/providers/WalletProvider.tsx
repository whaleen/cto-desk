// src/providers/WalletProvider.tsx
'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { FC, ReactNode, useMemo, useEffect, useState } from 'react';

require('@solana/wallet-adapter-react-ui/styles.css');

export const WalletProviders: FC<{ children: ReactNode }> = ({ children }) => {
  // Track if window is available
  const [isWindowAvailable, setIsWindowAvailable] = useState(false);

  useEffect(() => {
    setIsWindowAvailable(true);
  }, []);

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(
    () => clusterApiUrl(network),
    [network]
  );

  // Only render wallet components on client side
  if (!isWindowAvailable) {
    return <>{children}</>;
  }

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
