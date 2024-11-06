// src/types/site.ts
export type TabType = 'general' | 'profile' | 'design'

export interface SiteTheme {
  primary: string
  secondary: string
  accent: string
  neutral: string
  'base-100': string
  'base-200': string
  'base-300': string
  'base-content': string
}

export interface SiteData {
  id: string
  name: string
  subdomain: string
  customDomain: string | null
  profileImage: string | null
  bannerImage: string | null
  description: string | null
  twitterUrl: string | null
  telegramUrl: string | null
  user: {
    wallet: string
  }
  theme?: SiteTheme
}

export const defaultTheme: SiteTheme = {
  primary: '#570df8',
  secondary: '#f000b8',
  accent: '#37cdbe',
  neutral: '#3d4451',
  'base-100': '#ffffff',
  'base-200': '#f2f2f2',
  'base-300': '#e5e6e6',
  'base-content': '#1f2937',
}
