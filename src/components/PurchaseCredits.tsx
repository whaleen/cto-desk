// src/components/PurchaseCredits.tsx
'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface PurchaseCreditsProps {
  onSuccess?: () => void;
}

export default function PurchaseCredits({ onSuccess }: PurchaseCreditsProps) {
  const { publicKey, signMessage } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    if (!publicKey || !signMessage) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a message to sign
      const message = new TextEncoder().encode(
        `Purchase 5 🍌 credits\nTimestamp: ${Date.now()}`
      );

      // Sign the message
      const signature = await signMessage(message);

      // Send to our API
      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: publicKey.toString(),
          signature: Buffer.from(signature).toString('base64'),
          message: Buffer.from(message).toString('base64'),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to purchase credits');
      }

      // Trigger refresh
      onSuccess?.();

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'toast toast-end';
      successMessage.innerHTML = `
        <div class="alert alert-success">
          <span>Successfully purchased 5 credits!</span>
        </div>
      `;
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);

    } catch (err) {
      console.error('Error purchasing credits:', err);
      setError(err instanceof Error ? err.message : 'Failed to purchase credits');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Purchase Credits</h2>
        <p className="text-sm opacity-70">Get 5 credits by signing a message (Demo Mode)</p>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div className="card-actions justify-end">
          <button
            onClick={handlePurchase}
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading || !publicKey}
          >
            {loading ? 'Processing...' : 'Get 5 Credits'}
          </button>
        </div>
      </div>
    </div>
  );
}
