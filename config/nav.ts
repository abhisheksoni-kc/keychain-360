export type NavItem = {
  label: string
  href: string
  icon: string
  badge?: number
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Keychain 360',
    items: [
      { label: 'Planned Products', href: '/planned-products', icon: 'rocket' },
      { label: 'Projects Posted', href: '/projects', icon: 'target', badge: 468 },
      { label: 'Forms & Data', href: '/forms', icon: 'file-text' },
      { label: 'My Supply Chain', href: '/supply-chain', icon: 'globe' },
      { label: 'Traceability', href: '/traceability', icon: 'map-pin' },
      { label: 'Recommendations', href: '/recommendations', icon: 'git-branch' },
      { label: 'Keychain AI', href: '/keychain-ai', icon: 'sparkles' },
    ],
  },
  {
    label: 'Data',
    items: [],
  },
]
