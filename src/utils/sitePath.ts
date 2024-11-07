// src/utils/sitePath.ts
// Reserved paths that users cannot use
const RESERVED_PATHS = [
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
  'portfolio',
]

export function isValidSitePath(path: string): boolean {
  return (
    !RESERVED_PATHS.includes(path.toLowerCase()) &&
    /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(path) &&
    !path.includes('--')
  )
}
