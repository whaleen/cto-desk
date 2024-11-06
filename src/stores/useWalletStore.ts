// src/stores/useWalletStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WalletState {
  isConnected: boolean
  isAdmin: boolean
  isWhitelisted: boolean
  wallet: string | null
  currentAddress: string | null
  isInitialized: boolean
  setWalletState: (
    state: Omit<
      WalletState,
      'setWalletState' | 'currentAddress' | 'setCurrentAddress'
    >
  ) => void
  setCurrentAddress: (address: string | null) => void
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      isConnected: false,
      isAdmin: false,
      isWhitelisted: false,
      wallet: null,
      currentAddress: null,
      isInitialized: false,
      setWalletState: (state) => set(state),
      setCurrentAddress: (address) => set({ currentAddress: address }),
    }),
    {
      name: 'wallet-storage',
    }
  )
)
