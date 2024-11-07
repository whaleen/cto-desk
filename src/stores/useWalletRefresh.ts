// src/stores/useWalletRefresh.ts
import { create } from 'zustand'

interface WalletRefreshStore {
  lastUpdate: number
  lastWallet: string | null
  triggerRefresh: (wallet: string) => void
}

export const useWalletRefresh = create<WalletRefreshStore>((set) => ({
  lastUpdate: Date.now(),
  lastWallet: null,
  triggerRefresh: (wallet) =>
    set({
      lastUpdate: Date.now(),
      lastWallet: wallet,
    }),
}))
