type PillVariant = 'verification' | 'quick-bid' | 'active' | 'in-review' | 'flagged' | 'violation' | 'shortlisted' | 'nda' | 'rfi' | 'planned-product' | 'neutral'

const PILL_STYLES: Record<string, { color: string; bg: string; border?: string }> = {
  'Verification': { color: '#374151', bg: '#FFFFFF', border: '#E5E7EB' },
  'Quick Bid':    { color: '#7E22CE', bg: '#F3E8FF' },
  'Active':       { color: '#15803D', bg: '#E7F5EC' },
  'Completed':    { color: '#15803D', bg: '#E7F5EC' },
  'Approved':     { color: '#15803D', bg: '#E7F5EC' },
  'In Review':    { color: '#2563EB', bg: '#EAF1FE' },
  'Flagged':      { color: '#92660C', bg: '#FEF3C7', border: '#FACC15' },
  'Violation':    { color: '#B91C1C', bg: '#FEE2E2', border: '#FCA5A5' },
  'Shortlisted':  { color: '#374151', bg: '#FFFFFF', border: '#E5E7EB' },
  'NDA':          { color: '#2563EB', bg: '#EAF1FE' },
  'RFI':          { color: '#92660C', bg: '#FEF3C7' },
  'Planned Product': { color: '#374151', bg: '#FFFFFF', border: '#E5E7EB' },
}

export function StatusPill({ label }: { label: string }) {
  const style = PILL_STYLES[label] ?? { color: '#374151', bg: '#F3F4F6' }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 600,
        padding: '2px 10px',
        color: style.color,
        background: style.bg,
        border: style.border ? `1px solid ${style.border}` : undefined,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}
