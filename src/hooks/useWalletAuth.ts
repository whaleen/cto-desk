// src/hooks/useWalletAuth.ts
'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'

interface WalletAuthState {
  isConnected: boolean
  isAdmin: boolean
  isWhitelisted: boolean
  isLoading: boolean
  error: string | null
  wallet: string | null
}

export function useWalletAuth() {
  const { connected, publicKey } = useWallet()
  const [state, setState] = useState<WalletAuthState>({
    isConnected: false,
    isAdmin: false,
    isWhitelisted: false,
    isLoading: true,
    error: null,
    wallet: null,
  })

  useEffect(() => {
    if (connected && publicKey) {
      checkAuth()
    } else {
      setState((prev) => ({
        ...prev,
        isConnected: false,
        isLoading: false,
        wallet: null,
      }))
    }
  }, [connected, publicKey])

  const checkAuth = async () => {
    if (!publicKey) return

    try {
      const wallet = publicKey.toString()
      setState((prev) => ({ ...prev, isLoading: true, wallet }))

      // Single auth check that returns all needed status
      const res = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet }),
      })

      if (!res.ok) throw new Error('Auth check failed')

      const data = await res.json()

      setState((prev) => ({
        ...prev,
        isConnected: true,
        isAdmin: data.isAdmin,
        isWhitelisted: data.isActive,
        isLoading: false,
        error: null,
      }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Authentication failed',
        isLoading: false,
      }))
    }
  }

  return state
}
