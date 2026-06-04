'use client'

import { NavIcon } from './NavIcon'

const BRAND_LOGOS = [
  { label: 'Amazon', initials: 'A', color: '#FF9900', bg: '#FFF8ED', border: '#FFCC80' },
  { label: 'Whole Foods', initials: 'WF', color: '#1a6b3a', bg: '#E8F5ED', border: '#86EFAC' },
]

export function TopBar() {
  return (
    <header
      style={{
        height: 'var(--topbar-h)',
        borderBottom: '1px solid var(--line)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 20px',
        background: 'white',
        flexShrink: 0,
      }}
    >
      {/* Search — pill shaped */}
      <div style={{ flex: 1, maxWidth: 500 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--bg-soft)',
            border: '1px solid var(--line)',
            borderRadius: 9999,
            padding: '7px 16px',
            color: 'var(--placeholder)',
            fontSize: 13.5,
            cursor: 'text',
          }}
        >
          <NavIcon name="search" size={15} />
          <span>Search by product, category or manufacturer</span>
        </div>
      </div>

      {/* Brand logos */}
      <div style={{ display: 'flex', alignItems: 'center', gap: -4, marginLeft: 4 }}>
        {BRAND_LOGOS.map((b, i) => (
          <div
            key={b.label}
            title={b.label}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: b.bg,
              border: `2px solid ${b.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: b.initials.length > 1 ? 10 : 13,
              fontWeight: 700,
              color: b.color,
              cursor: 'pointer',
              marginLeft: i > 0 ? -6 : 0,
              zIndex: BRAND_LOGOS.length - i,
              position: 'relative',
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
          border: '1px solid #D1D5DB',
          borderRadius: 6,
          background: 'white',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--ink)',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        <NavIcon name="user-plus" size={14} />
        Invite
      </button>

      {/* Notification bell */}
      <div style={{ position: 'relative' }}>
        <button
          style={{
            width: 34,
            height: 34,
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
            top: -3,
            right: -4,
            background: '#EF4444',
            color: 'white',
            borderRadius: 9999,
            fontSize: 9,
            fontWeight: 700,
            padding: '1px 4px',
            lineHeight: 1.5,
            minWidth: 16,
            textAlign: 'center',
          }}
        >
          50
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 28, background: 'var(--line)', marginLeft: 2, marginRight: 2 }} />

      {/* Avatar + user info */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px 0',
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
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          ab
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2 }}>
            abhishek+amazon
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--muted2)', lineHeight: 1.2 }}>
            Amazon
          </div>
        </div>
        <NavIcon name="chevron-down" size={14} />
      </button>
    </header>
  )
}
