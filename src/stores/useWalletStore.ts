// src/stores/useWalletStore.ts
import { useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Add UserData interface
interface UserData {
  id: string
  wallet: string
  isActive: boolean
  isAdmin: boolean
  createdAt: string
  creditBalance: number
}

// Add to existing Site interface
interface Site {
  id: string
  name: string
  subdomain: string | null
  customDomain: string | null
  userId: string
}

interface WalletState {
  // Existing state
  error: string | null
  isConnected: boolean
  isAdmin: boolean
  isWhitelisted: boolean
  wallet: string | null
  currentAddress: string | null
  isInitialized: boolean
  sites: Site[]
  sitesLoading: boolean
  lastSitesFetch: number | null

  // Add user data state
  userData: UserData | null
  userDataLoading: boolean
  lastUserDataFetch: number | null

  // Existing actions
  setWalletState: (
    state: Omit<
      WalletState,
      | 'setWalletState'
      | 'currentAddress'
      | 'setCurrentAddress'
      | 'sites'
      | 'setSites'
      | 'sitesLoading'
      | 'setSitesLoading'
      | 'lastSitesFetch'
      | 'fetchSites'
      | 'userData'
      | 'setUserData'
      | 'userDataLoading'
      | 'lastUserDataFetch'
      | 'fetchUserData'
    >
  ) => void
  setCurrentAddress: (address: string | null) => void
  setSites: (sites: Site[]) => void
  setSitesLoading: (loading: boolean) => void
  fetchSites: (forceRefresh?: boolean) => Promise<void>

  // Add user data actions
  setUserData: (userData: UserData | null) => void
  fetchUserData: (forceRefresh?: boolean) => Promise<void>
  refreshAll: () => Promise<void>
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      // Existing state
      error: null,
      isConnected: false,
      isAdmin: false,
      isWhitelisted: false,
      wallet: null,
      currentAddress: null,
      isInitialized: false,
      sites: [],
      sitesLoading: false,
      lastSitesFetch: null,

      // User data state
      userData: null,
      userDataLoading: false,
      lastUserDataFetch: null,

      // Existing actions
      setWalletState: (state) => set(state),
      setCurrentAddress: (address) => set({ currentAddress: address }),
      setSites: (sites) => set({ sites, lastSitesFetch: Date.now() }),
      setSitesLoading: (loading) => set({ sitesLoading: loading }),
      setUserData: (userData) =>
        set({ userData, lastUserDataFetch: Date.now() }),

      refreshAll: async () => {
        const state = get()
        if (state.currentAddress) {
          await Promise.all([get().fetchUserData(true), get().fetchSites(true)])
        }
      },

      // Fetch user data
      fetchUserData: async (forceRefresh = false) => {
        const state = get()
        const now = Date.now()

        if (
          !forceRefresh &&
          state.lastUserDataFetch &&
          now - state.lastUserDataFetch < CACHE_DURATION &&
          state.userData
        ) {
          return
        }

        if (!state.isConnected || !state.currentAddress) {
          set({
            userData: null,
            lastUserDataFetch: now,
            isWhitelisted: false,
            isAdmin: false,
            error: null,
          })
          return
        }

        try {
          set({ userDataLoading: true, error: null })

          const res = await fetch('/api/auth/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              wallet: state.currentAddress,
            }),
          })

          if (!res.ok) {
            throw new Error('Failed to verify access')
          }

          const data = await res.json()
          set({
            userData: data.user,
            isWhitelisted: data.isActive,
            isAdmin: data.user.isAdmin,
            lastUserDataFetch: now,
            userDataLoading: false,
            error: null,
          })
        } catch (error) {
          console.error('Error fetching user data:', error)
          set({
            userData: null,
            lastUserDataFetch: now,
            userDataLoading: false,
            isWhitelisted: false,
            isAdmin: false,
            error:
              error instanceof Error
                ? error.message
                : 'Failed to verify access',
          })
        }
      },

      // Fetch sites
      fetchSites: async (forceRefresh = false) => {
        const state = get()
        const now = Date.now()

        if (
          !forceRefresh &&
          state.lastSitesFetch &&
          now - state.lastSitesFetch < CACHE_DURATION &&
          state.sites.length > 0
        ) {
          return
        }

        if (!state.isConnected || !state.currentAddress) {
          set({
            sites: [],
            lastSitesFetch: now,
            error: null,
          })
          return
        }

        try {
          set({ sitesLoading: true, error: null })

          const response = await fetch('/api/sites', {
            headers: {
              'Content-Type': 'application/json',
              'x-wallet-address': state.currentAddress,
            },
          })

          if (!response.ok) {
            throw new Error('Failed to fetch sites')
          }

          const data = await response.json()
          set({
            sites: data.sites,
            lastSitesFetch: now,
            sitesLoading: false,
            error: null,
          })
        } catch (error) {
          console.error('Error fetching sites:', error)
          set({
            sites: [],
            lastSitesFetch: now,
            sitesLoading: false,
            error:
              error instanceof Error ? error.message : 'Failed to fetch sites',
          })
        }
      },
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        isConnected: state.isConnected,
        isAdmin: state.isAdmin,
        isWhitelisted: state.isWhitelisted,
        wallet: state.wallet,
        currentAddress: state.currentAddress,
        isInitialized: state.isInitialized,
      }),
    }
  )
)

// Helper hook for checking site ownership
export function useSiteOwnership(siteId: string | undefined) {
  const { sites, sitesLoading, fetchSites } = useWalletStore()

  // Effect to ensure sites are loaded
  useEffect(() => {
    fetchSites()
  }, [fetchSites])

  if (!siteId) return { isOwner: false, isLoading: false }

  return {
    isOwner: sites.some((site) => site.id === siteId),
    isLoading: sitesLoading,
  }
}
