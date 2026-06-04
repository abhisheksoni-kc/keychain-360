'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { StatusPill } from '@/components/ui/StatusPill'

type Product = {
  id: string
  name: string
  brand: string
  category: string
  thumbnail: string
}

const VOLUME_UNITS = ['units', 'lbs', 'cases', 'pallets', 'tons']
const VOLUME_RANGES = ['< 10,000', '10,000–50,000', '50,000–250,000', '250,000–1M', '1M+']
const PACKAGING_OPTIONS = ['Misc Material Box', 'Flexible Pouch', 'Rigid Container', 'Bottle', 'Can', 'Bag-in-Box', 'Stand-up Pouch', 'Tray']

export default function PostProjectPage({ params }: { params: { productId: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [posting, setPosting] = useState(false)
  const [posted, setPosted] = useState(false)

  const [form, setForm] = useState({
    description: '',
    volumeRange: '',
    volumeUnit: 'units',
    packagingFormat: 'Misc Material Box',
    openToOtherPackaging: false,
    location: 'Global',
    allergens: false,
    certifications: false,
    additionalReq: false,
    teamProject: 'Private project',
    hideCurrent: false,
    hideSpecific: false,
    criteria: '',
  })

  useEffect(() => {
    fetch(`/api/products/${params.productId}`)
      .then(r => r.json())
      .then(data => { if (!data.error) setProduct(data) })
      .catch(() => {})
  }, [params.productId])

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return
    setPosting(true)

    const projectRes = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        name: product.name,
        status: 'Active',
        type: 'Planned Product',
        thumbnail: product.thumbnail,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        teamMembers: 1,
        supplierIds: [],
      }),
    })
    const newProject = await projectRes.json()

    await fetch(`/api/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: newProject.id, stage: 'Shortlisted', nextStep: 'Begin Verification' }),
    })

    setPosted(true)
    setTimeout(() => router.push(`/planned-products/${newProject.id}`), 1500)
  }

  if (posted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E7F5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#15803D' }}>
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>Project Posted!</h2>
          <p style={{ fontSize: 13.5, color: 'var(--muted2)' }}>Redirecting to your project…</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100%' }}>
      {/* ── Left: Form ─────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: '32px 48px', overflowY: 'auto', maxWidth: 600 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', marginBottom: 28 }}>Define your project</h1>

        <form onSubmit={handleSubmit}>
          {/* What are you looking to make */}
          <Field label="What are you looking to make?*">
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Include information like - Product details, number of runs, production capabilities, timing, etc."
              rows={4}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </Field>

          {/* Estimated annual volume */}
          <Field label="Estimated annual volume*">
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={form.volumeRange} onChange={e => set('volumeRange', e.target.value)} style={{ ...selectStyle, flex: 1, width: 'auto' }}>
                <option value="">Volume range</option>
                {VOLUME_RANGES.map(v => <option key={v}>{v}</option>)}
              </select>
              <select value={form.volumeUnit} onChange={e => set('volumeUnit', e.target.value)} style={{ ...selectStyle, width: 110, flex: 'none' }}>
                {VOLUME_UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </Field>

          {/* Packaging format */}
          <Field label="Packaging Format*">
            <div style={{ position: 'relative' }}>
              <select value={form.packagingFormat} onChange={e => set('packagingFormat', e.target.value)} style={{ ...selectStyle, width: '100%' }}>
                {PACKAGING_OPTIONS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </Field>

          {/* Open to other packaging */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: 13.5, color: 'var(--ink)' }}>We're open to other packaging formats and sizes</span>
            <label style={{ position: 'relative', display: 'inline-block', width: 40, height: 22, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.openToOtherPackaging} onChange={e => set('openToOtherPackaging', e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{
                position: 'absolute', inset: 0, borderRadius: 'var(--pill)',
                background: form.openToOtherPackaging ? 'var(--ink)' : 'var(--line2)',
                transition: 'background 0.2s',
              }}>
                <span style={{
                  position: 'absolute', top: 2, left: form.openToOtherPackaging ? 20 : 2,
                  width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.2s',
                }} />
              </span>
            </label>
          </div>

          {/* Supplier location */}
          <Field label="Supplier location (optional) ⓘ">
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Select countries" style={{ ...inputStyle, paddingRight: 36 }} />
              <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, background: 'var(--ink)', color: 'white', borderRadius: 'var(--pill)', padding: '2px 8px', fontWeight: 600, cursor: 'pointer' }}>
                Global ×
              </span>
            </div>
          </Field>

          {/* Extra requirements */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { key: 'allergens', label: '+ Allergen requirements' },
              { key: 'certifications', label: '+ Certification requirements' },
              { key: 'additionalReq', label: '+ Additional requirement' },
            ].map(item => (
              <button key={item.key} type="button"
                onClick={() => set(item.key, !form[item.key as keyof typeof form])}
                style={{ fontSize: 13, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontWeight: 500 }}>
                {form[item.key as keyof typeof form] ? '− ' + item.label.slice(2) : item.label}
              </button>
            ))}
          </div>

          {/* Team project */}
          <Field label="Team project">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select value={form.teamProject} onChange={e => set('teamProject', e.target.value)} style={{ ...selectStyle, flex: 1, width: 'auto' }}>
                <option>Private project</option>
                <option>Team project</option>
              </select>
              <button type="button" style={{ fontSize: 13, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap' }}>
                + Add Team Members
              </button>
            </div>
          </Field>

          {/* Product-Specific Criteria */}
          <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--r)', overflow: 'hidden', marginBottom: 28 }}>
            <div style={{ padding: '12px 16px', background: 'var(--bg-soft)', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>Product-Specific Criteria</span>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--muted2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: 'var(--ink)' }}>Hide from my current manufacturers.</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--blue)', cursor: 'pointer' }}>View</span>
                  <label style={{ position: 'relative', display: 'inline-block', width: 36, height: 20, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.hideCurrent} onChange={e => set('hideCurrent', e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{ position: 'absolute', inset: 0, borderRadius: 'var(--pill)', background: form.hideCurrent ? 'var(--ink)' : 'var(--line2)', transition: 'background 0.2s' }}>
                      <span style={{ position: 'absolute', top: 2, left: form.hideCurrent ? 17 : 2, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                    </span>
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: 'var(--ink)' }}>Hide from specific manufacturers</span>
                <button type="button" style={{ fontSize: 13, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>+ Add Manufacturer</button>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--ink)' }}>Product-Specific Criteria ⓘ</span>
                <select style={{ ...selectStyle, flex: 1, width: 'auto', fontSize: 13 }}>
                  <option>Select Criteria Set</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bottom navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button type="button" onClick={() => history.back()}
              style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--line2)', borderRadius: 'var(--r-sm)', background: 'white', cursor: 'pointer', color: 'var(--ink)' }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
            <button type="submit" disabled={posting}
              style={{ flex: 1, padding: '12px', borderRadius: 'var(--r-sm)', border: 'none', background: posting ? 'var(--line)' : 'var(--yellow)', fontSize: 14, fontWeight: 600, cursor: posting ? 'default' : 'pointer', color: 'var(--ink)' }}>
              {posting ? 'Posting…' : 'Post this project'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Right: Product summary card ─────────────────────────────────────────── */}
      {product && (
        <div style={{ width: 300, flexShrink: 0, borderLeft: '1px solid var(--line)', padding: '32px 24px', background: 'white', overflowY: 'auto' }}>
          <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 'var(--r-lg)', background: 'var(--bg-soft)', border: '1px solid var(--line)', overflow: 'hidden', marginBottom: 16 }}>
            <img src={product.thumbnail} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{product.brand}</span>
            <StatusPill label={product.category} />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 10, lineHeight: 1.3 }}>{product.name}</h3>
          <p style={{ fontSize: 13, color: 'var(--muted2)', lineHeight: 1.6, marginBottom: 14 }}>
            Private-label sourcing project. Keychain AI has pre-filled details based on your product catalog.{' '}
            <span style={{ color: 'var(--blue)', cursor: 'pointer', fontWeight: 500 }}>Read More</span>
          </p>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>Manufacturing Processes</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {['Weigher', 'Depositor', '+8'].map(p => (
                <span key={p} style={{ padding: '3px 9px', borderRadius: 'var(--pill)', background: 'var(--bg-soft)', border: '1px solid var(--line)', fontSize: 11.5, fontWeight: 500, color: 'var(--muted)' }}>{p}</span>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>Packaging Material</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {['Box'].map(p => (
                <span key={p} style={{ padding: '3px 9px', borderRadius: 'var(--pill)', background: 'var(--bg-soft)', border: '1px solid var(--line)', fontSize: 11.5, fontWeight: 500, color: 'var(--muted)' }}>{p}</span>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14, fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>$17.27 SRP</div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 13.5, fontWeight: 500, color: 'var(--ink)', marginBottom: 7 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 8,
  border: '1px solid #E5E7EB',
  fontSize: 13.5,
  color: '#020817',
  outline: 'none',
  background: 'white',
  fontFamily: 'inherit',
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 36px 9px 12px',
  borderRadius: 8,
  border: '1px solid #E5E7EB',
  fontSize: 13.5,
  color: '#020817',
  background: `white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236B7280'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E") no-repeat right 10px center / 16px`,
  outline: 'none',
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
}
