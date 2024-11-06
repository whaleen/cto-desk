// src/providers/WalletProvider.tsx
'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { clusterApiUrl, Commitment, PublicKey } from '@solana/web3.js';
import dynamic from 'next/dynamic';
import { type FC, type ReactNode, useMemo, useEffect } from 'react';
import { useWalletStore } from '@/stores/useWalletStore';

require('@solana/wallet-adapter-react-ui/styles.css');

// Add Phantom wallet types
interface PhantomEvent {
  type: string;
  data: unknown;
}

interface PhantomProvider {
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: (event: PhantomEvent) => void) => void;
  off: (event: string, callback: (event: PhantomEvent) => void) => void;
  isConnected: boolean;
  publicKey: PublicKey | null;
}

interface WindowWithPhantom extends Window {
  phantom?: {
    solana?: PhantomProvider;
  };
}

// Separate component to handle wallet state management
const WalletStateHandler: FC<{ children: ReactNode }> = ({ children }) => {
  const { connected, publicKey, wallet } = useWallet();
  const setCurrentAddress = useWalletStore(state => state.setCurrentAddress);
  const setWalletState = useWalletStore(state => state.setWalletState);

  const updateWalletState = async (address: string) => {
    console.log('Updating wallet state for address:', address);
    try {
      const res = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: address }),
      });

      if (res.ok) {
        const data = await res.json();
        setWalletState({
          isConnected: true,
          isAdmin: data.isAdmin,
          isWhitelisted: data.isActive,
          wallet: address
        });
      } else {
        throw new Error('Failed to verify wallet');
      }
    } catch (error) {
      console.error('Error updating wallet state:', error);
      setWalletState({
        isConnected: false,
        isAdmin: false,
        isWhitelisted: false,
        wallet: null
      });
    }
  };

  // Handle initial connection and subsequent changes
  useEffect(() => {
    if (connected && publicKey) {
      const address = publicKey.toString();
      console.log('Wallet connected:', address);
      setCurrentAddress(address);
      updateWalletState(address);
    } else {
      console.log('Wallet disconnected');
      setCurrentAddress(null);
      setWalletState({
        isConnected: false,
        isAdmin: false,
        isWhitelisted: false,
        wallet: null
      });
    }
  }, [connected, publicKey, setCurrentAddress, setWalletState]);

  // Handle Phantom-specific account changes
  useEffect(() => {
    const handleAccountChange = async (event: PhantomEvent) => {
      const phantom = (window as WindowWithPhantom).phantom?.solana;
      if (phantom?.publicKey) {
        const newAddress = phantom.publicKey.toString();
        console.log('Account changed:', newAddress);
        setCurrentAddress(newAddress);
        await updateWalletState(newAddress);
      }
    };

    // Set up account change listener
    const setupPhantomListener = () => {
      const phantom = (window as WindowWithPhantom).phantom?.solana;
      if (phantom) {
        console.log('Setting up Phantom account change listener');
        phantom.on('accountChanged', handleAccountChange);
        return () => {
          phantom.off('accountChanged', handleAccountChange);
        };
      }
    };

    // Delay setup slightly to ensure provider is ready
    const timeoutId = setTimeout(setupPhantomListener, 100);

    return () => {
      clearTimeout(timeoutId);
      const phantom = (window as WindowWithPhantom).phantom?.solana;
      if (phantom) {
        phantom.off('accountChanged', handleAccountChange);
      }
    };
  }, [setCurrentAddress, setWalletState]);

  return <>{children}</>;
};

const WalletProviderComponent: FC<{ children: ReactNode }> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    []
  );

  const config = useMemo(() => ({
    commitment: 'confirmed' as Commitment,
    wsEndpoint: endpoint.replace('https', 'wss'),
    preflightCommitment: 'confirmed' as Commitment,
  }), [endpoint]);

  return (
    <ConnectionProvider endpoint={endpoint} config={config}>
      <WalletProvider
        wallets={wallets}
        autoConnect
        onError={(error) => {
          console.error('Wallet error:', error);
        }}
      >
        <WalletModalProvider>
          <WalletStateHandler>
            {children}
          </WalletStateHandler>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

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
