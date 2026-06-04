'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_GROUPS } from '@/config/nav'
import { NavIcon } from './NavIcon'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{ width: 'var(--sidebar-w)', borderRight: '1px solid var(--line)' }}
      className="flex flex-col h-full bg-white shrink-0 overflow-y-auto"
    >
      {/* Wordmark */}
      <div className="flex items-center gap-2 px-5 py-5">
        <span style={{ fontSize: 15, fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
          keychain®
        </span>
        <span
          style={{
            background: 'var(--ink)',
            color: 'white',
            borderRadius: 7,
            fontSize: 12,
            fontWeight: 700,
            padding: '2px 8px',
            letterSpacing: '0.01em',
          }}
        >
          360
        </span>
      </div>

      {/* Search row */}
      <div className="px-3 mb-3">
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '7px 10px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--bg-soft)',
            color: 'var(--muted2)',
            fontSize: 13,
            cursor: 'text',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <NavIcon name="search" size={14} />
            Search
          </span>
          <NavIcon name="chevron-right" size={14} />
        </button>
      </div>

      {/* Nav groups */}
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="mb-4">
          {/* Group header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 12px 4px 12px',
              marginBottom: 2,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 400,
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {group.label}
            </span>
            <NavIcon name="chevron-down" size={13} />
          </div>

          {/* Nav items */}
          <ul style={{ listStyle: 'none', padding: '0 8px' }}>
            {group.items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '0 8px',
                      height: 36,
                      borderRadius: 6,
                      background: active ? '#FDE047' : 'transparent',
                      color: 'var(--ink)',
                      fontSize: 13.5,
                      fontWeight: active ? 500 : 400,
                      textDecoration: 'none',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.background =
                          '#F3F4F6'
                    }}
                    onMouseLeave={(e) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.background =
                          'transparent'
                    }}
                  >
                    <span style={{ opacity: active ? 1 : 0.65, display: 'flex', alignItems: 'center' }}>
                      <NavIcon name={item.icon} size={15} />
                    </span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge != null && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          background: active
                            ? 'rgba(0,0,0,0.10)'
                            : '#EBEBEB',
                          color: active ? 'var(--ink)' : 'var(--muted)',
                          borderRadius: 9999,
                          padding: '1px 7px',
                        }}
                      >
                        {item.badge.toLocaleString()}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
            {group.items.length === 0 && (
              <li
                style={{
                  padding: '4px 10px',
                  fontSize: 12,
                  color: 'var(--placeholder)',
                }}
              >
                No items
              </li>
            )}
          </ul>
        </div>
      ))}
    </aside>
  )
}
