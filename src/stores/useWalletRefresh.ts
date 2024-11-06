// src/stores/useWalletRefresh.ts
import { create } from 'zustand'

interface WalletRefreshStore {
  lastUpdate: number
  triggerRefresh: () => void
}

export const useWalletRefresh = create<WalletRefreshStore>((set) => ({
  lastUpdate: Date.now(),
  triggerRefresh: () => set({ lastUpdate: Date.now() }),
}))
