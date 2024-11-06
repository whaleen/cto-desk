// src/components/WalletButton.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { useWalletStore } from '@/stores/useWalletStore';

export function WalletButton() {
  const { connected, wallet, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { currentAddress } = useWalletStore();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <button className="btn btn-primary">Connect Wallet</button>;
  }

  if (!wallet) {
    return (
      <button
        className="btn btn-primary"
        onClick={() => setVisible(true)}
      >
        Select Wallet
      </button>
    );
  }

  const walletAddress = currentAddress
    ? `${currentAddress.slice(0, 4)}..${currentAddress.slice(-4)}`
    : '';

  return (
    <div className="dropdown dropdown-end">
      <button
        className="btn btn-sm btn-primary"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {connected ? (
          <>
            <span>{wallet.adapter.name}</span>
            {walletAddress && <span className="ml-2">{walletAddress}</span>}
          </>
        ) : (
          <span onClick={() => setVisible(true)}>Connect {wallet.adapter.name}</span>
        )}
      </button>

      {connected && dropdownOpen && (
        <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box">
          <li>
            <button
              onClick={() => {
                if (currentAddress) {
                  navigator.clipboard.writeText(currentAddress);
                }
                setDropdownOpen(false);
              }}
            >
              Copy address
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setVisible(true);
                setDropdownOpen(false);
              }}
            >
              Change wallet
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                disconnect();
                setDropdownOpen(false);
              }}
            >
              Disconnect
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
