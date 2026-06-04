/**
 * ProductAvatar — renders a colored square with the product's first letter.
 * Matches the real Keychain 360 app behavior where product images are unavailable.
 */

// Deterministic palette: pick a color based on the first char code
const PALETTES = [
  { bg: '#DBEAFE', color: '#1D4ED8' }, // blue
  { bg: '#D1FAE5', color: '#065F46' }, // green
  { bg: '#FEF3C7', color: '#92400E' }, // amber
  { bg: '#F3E8FF', color: '#7E22CE' }, // purple
  { bg: '#FEE2E2', color: '#B91C1C' }, // red
  { bg: '#E0F2FE', color: '#0369A1' }, // sky
  { bg: '#FCE7F3', color: '#9D174D' }, // pink
  { bg: '#F0FDF4', color: '#15803D' }, // lime-green
  { bg: '#FFF7ED', color: '#C2410C' }, // orange
  { bg: '#EEF2FF', color: '#3730A3' }, // indigo
]

function getPalette(name: string) {
  const code = (name.charCodeAt(0) || 65) % PALETTES.length
  return PALETTES[code]
}

interface ProductAvatarProps {
  name: string
  size?: number
  radius?: number
}

export function ProductAvatar({ name, size = 36, radius = 8 }: ProductAvatarProps) {
  const letter = (name || '?')[0].toUpperCase()
  const { bg, color } = getPalette(name || '')

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.round(size * 0.38),
        fontWeight: 700,
        color,
        flexShrink: 0,
        userSelect: 'none',
        letterSpacing: '-0.01em',
      }}
      aria-label={name}
    >
      {letter}
    </div>
  )
}
