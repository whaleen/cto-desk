// src/stores/useWalletStore.ts
import { create } from 'zustand'

interface WalletState {
  isConnected: boolean
  isAdmin: boolean
  isWhitelisted: boolean
  wallet: string | null
  currentAddress: string | null
  setWalletState: (
    state: Omit<
      WalletState,
      'setWalletState' | 'currentAddress' | 'setCurrentAddress'
    >
  ) => void
  setCurrentAddress: (address: string | null) => void
}

export const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  isAdmin: false,
  isWhitelisted: false,
  wallet: null,
  currentAddress: null,
  setWalletState: (state) => set(state),
  setCurrentAddress: (address) => set({ currentAddress: address }),
}))
