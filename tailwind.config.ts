import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        yellow: { DEFAULT: '#FDE047', press: '#FACC15' },
        ink: { DEFAULT: '#020817', 2: '#111827' },
        muted: { DEFAULT: '#4B5563', 2: '#6B7280' },
        placeholder: '#9CA3AF',
        line: { DEFAULT: '#E5E7EB', 2: '#D1D5DB' },
        'bg-soft': '#F6F6F4',
        'pill-green': { DEFAULT: '#15803D', bg: '#E7F5EC' },
        'pill-blue': { DEFAULT: '#2563EB', bg: '#EAF1FE' },
        'pill-amber': { DEFAULT: '#92660C', bg: '#FEF3C7' },
        'pill-red': { DEFAULT: '#B91C1C', bg: '#FEE2E2' },
        'pill-purple': { DEFAULT: '#7E22CE', bg: '#F3E8FF' },
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        lg: '14px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(17,24,39,.06),0 1px 2px rgba(17,24,39,.04)',
      },
      width: { sidebar: '253px' },
      height: { topbar: '64px' },
    },
  },
  plugins: [],
}
export default config
