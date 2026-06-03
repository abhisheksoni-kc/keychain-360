'use client'

import { NavIcon } from './NavIcon'

const BRAND_LOGOS = [
  { label: 'Amazon', initials: 'A', color: '#FF9900', bg: '#FFF8ED' },
  { label: 'WF', initials: 'WF', color: '#1a6b3a', bg: '#E8F5ED' },
]

export function TopBar() {
  return (
    <header
      style={{
        height: 'var(--topbar-h)',
        borderBottom: '1px solid var(--line)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 24px',
        background: 'white',
        flexShrink: 0,
      }}
    >
      {/* Search */}
      <div style={{ flex: 1, maxWidth: 480 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--bg-soft)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--pill)',
            padding: '8px 14px',
            color: 'var(--placeholder)',
            fontSize: 13.5,
          }}
        >
          <NavIcon name="search" size={15} />
          <span>Search by product, category or manufacturer</span>
        </div>
      </div>

      {/* Brand logos */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {BRAND_LOGOS.map((b) => (
          <div
            key={b.label}
            title={b.label}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: b.bg,
              border: '1.5px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
              color: b.color,
              cursor: 'pointer',
            }}
          >
            {b.initials}
          </div>
        ))}
      </div>

      {/* Invite button */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          border: '1px solid var(--line2)',
          borderRadius: 'var(--r-sm)',
          background: 'white',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--ink)',
          cursor: 'pointer',
        }}
      >
        <NavIcon name="user-plus" size={14} />
        Invite
      </button>

      {/* Notification bell */}
      <div style={{ position: 'relative' }}>
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid var(--line)',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--ink)',
          }}
        >
          <NavIcon name="bell" size={16} />
        </button>
        <span
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            background: '#EF4444',
            color: 'white',
            borderRadius: 'var(--pill)',
            fontSize: 10,
            fontWeight: 700,
            padding: '1px 5px',
            lineHeight: 1.4,
          }}
        >
          3
        </span>
      </div>

      <div style={{ width: 1, height: 28, background: 'var(--line)' }} />

      {/* Avatar + user info */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--ink)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          AS
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2 }}>
            abhishek+amazon
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--muted2)', lineHeight: 1.2 }}>
            Amazon Grocery
          </div>
        </div>
        <NavIcon name="chevron-down" size={14} />
      </button>
    </header>
  )
}
