// src/lib/domain.ts

export function getBaseUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    return 'nil.computer'
  }
  return 'localhost:3000'
}

export function getDomainWithProtocol(): string {
  const baseUrl = getBaseUrl()
  if (process.env.NODE_ENV === 'production') {
    return `https://${baseUrl}`
  }
  return `http://${baseUrl}`
}

export function createSiteUrl(path: string): string {
  const baseUrl = getBaseUrl()
  if (process.env.NODE_ENV === 'production') {
    return `https://${baseUrl}/${path}`
  }
  return `http://${baseUrl}/${path}`
}

export function isReservedPath(path: string): boolean {
  const reservedPaths = [
    'admin',
    'api',
    'dashboard',
    'login',
    'signup',
    'faq',
    'contact',
    'about',
    'terms',
    'privacy',
    'help',
    'settings',
    'profile',
    'search',
    // Add other reserved paths
  ]

  return reservedPaths.includes(path.toLowerCase())
}
