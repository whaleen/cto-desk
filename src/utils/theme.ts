// src/utils/theme.ts
export function hexToHSL(hex: string | undefined): string {
  // Default fallback color if undefined is provided
  if (!hex) return '0 0% 0%'

  // Remove the # if present
  hex = hex.replace('#', '')

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  // Find min and max values
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  let h = 0
  let s = 0
  let l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  // Convert to degrees and percentages
  h = Math.round(h * 360)
  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return `${h} ${s}% ${l}%`
}

// Helper function to validate hex color
export function isValidHexColor(hex: string | undefined): boolean {
  if (!hex) return false
  const regex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return regex.test(hex)
}

export function convertThemeToHSL(theme: Record<string, string>) {
  const convertedTheme: Record<string, string> = {}

  for (const [key, value] of Object.entries(theme)) {
    if (value && value.startsWith('#')) {
      convertedTheme[key] = hexToHSL(value)
    } else {
      convertedTheme[key] = value
    }
  }

  return convertedTheme
}
