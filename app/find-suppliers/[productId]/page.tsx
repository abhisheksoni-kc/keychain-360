'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { NavIcon } from '@/components/shell/NavIcon'

type SupplierCard = {
  id: string
  name: string
  initials: string
  color: string
  bg: string
  location: string
  categories: string[]
  certifications: string[]
  volume: string
  isKeychainRecommended: boolean
  isInNetwork: boolean
  keychainPreferred?: boolean
}

const DEMO_SUPPLIERS: SupplierCard[] = [
  { id: 'sc1', name: 'Arevalo Foods', initials: 'AF', color: '#1d4ed8', bg: '#dbeafe', location: 'California, USA', categories: ['Snacks', 'Popcorn'], certifications: ['SQF', 'Non-GMO'], volume: '50K–500K units/mo', isKeychainRecommended: true, isInNetwork: false },
  { id: 'sc2', name: 'Mitten Gourmet', initials: 'MG', color: '#065f46', bg: '#d1fae5', location: 'Michigan, USA', categories: ['Snacks', 'Specialty Foods'], certifications: ['GFSI', 'Kosher'], volume: '10K–100K units/mo', isKeychainRecommended: true, isInNetwork: true },
  { id: 'sc3', name: 'Roskam Foods', initials: 'RF', color: '#7e22ce', bg: '#f3e8ff', location: 'Grand Rapids, MI', categories: ['Snacks', 'Crackers', 'Popcorn'], certifications: ['BRC', 'SQF', 'Organic'], volume: '100K–1M units/mo', isKeychainRecommended: true, isInNetwork: false, keychainPreferred: true },
  { id: 'sc4', name: 'G & S Foods', initials: 'GS', color: '#92660c', bg: '#fef3c7', location: 'Chicago, IL', categories: ['Snacks', 'Popcorn'], certifications: ['Non-GMO'], volume: '20K–200K units/mo', isKeychainRecommended: true, isInNetwork: false },
  { id: 'sc5', name: 'Redwood Valley Foods', initials: 'RV', color: '#b91c1c', bg: '#fee2e2', location: 'Sonoma, CA', categories: ['Natural Foods', 'Snacks'], certifications: ['USDA Organic', 'Non-GMO'], volume: '5K–50K units/mo', isKeychainRecommended: false, isInNetwork: true },
  { id: 'sc6', name: 'Pacific Foods Group', initials: 'PF', color: '#0369a1', bg: '#e0f2fe', location: 'Portland, OR', categories: ['Natural Foods', 'Snacks', 'Beverages'], certifications: ['SQF', 'Kosher', 'Gluten-Free'], volume: '50K–500K units/mo', isKeychainRecommended: false, isInNetwork: true },
  { id: 'sc7', name: 'Summit Snack Co', initials: 'SS', color: '#15803d', bg: '#e7f5ec', location: 'Denver, CO', categories: ['Snacks', 'Trail Mix', 'Popcorn'], certifications: ['Non-GMO', 'GFSI'], volume: '25K–250K units/mo', isKeychainRecommended: false, isInNetwork: true },
  { id: 'sc8', name: 'Heartland Processors', initials: 'HP', color: '#d97706', bg: '#fef3c7', location: 'Iowa City, IA', categories: ['Snacks', 'Grain Products'], certifications: ['SQF', 'Kosher', 'BRC'], volume: '200K–2M units/mo', isKeychainRecommended: true, isInNetwork: false },
]

const CERT_OPTIONS = ['USDA Organic', 'Non-GMO', 'Kosher', 'Gluten-Free', 'SQF', 'BRC', 'GFSI', 'FSSC 22000']
const LOCATION_OPTIONS = ['California', 'Michigan', 'Illinois', 'Oregon', 'Colorado', 'Iowa']

export default function FindSuppliersPage({ params }: { params: { productId: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'recommended' | 'network'>('recommended')
  const [shortlisted, setShortlisted] = useState<SupplierCard[]>([])
  const [selectedCerts, setSelectedCerts] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [posting, setPosting] = useState(false)
  const [productName, setProductName] = useState('Product')

  useEffect(() => {
    fetch(`/api/products/${params.productId}`)
      .then(r => r.json())
      .then(d => { if (d.name) setProductName(d.name) })
      .catch(() => {})
  }, [params.productId])

  const filtered = DEMO_SUPPLIERS.filter(s => {
    if (activeTab === 'recommended' && !s.isKeychainRecommended) return false
    if (activeTab === 'network' && !s.isInNetwork) return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    if (selectedCerts.length > 0 && !selectedCerts.some(c => s.certifications.includes(c))) return false
    if (selectedLocations.length > 0 && !selectedLocations.some(l => s.location.includes(l))) return false
    return true
  })

  const isShortlisted = (id: string) => shortlisted.some(s => s.id === id)

  const toggleShortlist = (supplier: SupplierCard) => {
    setShortlisted(prev => isShortlisted(supplier.id) ? prev.filter(s => s.id !== supplier.id) : [...prev, supplier])
  }

  const handlePostProject = async () => {
    setPosting(true)
    router.push(`/post-project/${params.productId}`)
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left: Filters sidebar */}
      <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid var(--line)', padding: '24px 16px', overflowY: 'auto', background: 'white' }}>
        <Link href="/planned-products" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)', textDecoration: 'none', marginBottom: 20 }}>
          <NavIcon name="arrow-left" size={13} /> All Products
        </Link>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Filters</div>

        {/* Certifications */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 10 }}>Certifications</div>
          {CERT_OPTIONS.map(cert => (
            <label key={cert} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 13, color: 'var(--ink)' }}>
              <input type="checkbox" checked={selectedCerts.includes(cert)}
                onChange={() => setSelectedCerts(prev => prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert])}
                style={{ accentColor: 'var(--ink)', width: 14, height: 14 }} />
              {cert}
            </label>
          ))}
        </div>

        {/* Location */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 10 }}>Location</div>
          {LOCATION_OPTIONS.map(loc => (
            <label key={loc} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 13, color: 'var(--ink)' }}>
              <input type="checkbox" checked={selectedLocations.includes(loc)}
                onChange={() => setSelectedLocations(prev => prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc])}
                style={{ accentColor: 'var(--ink)', width: 14, height: 14 }} />
              {loc}
            </label>
          ))}
        </div>

        {(selectedCerts.length > 0 || selectedLocations.length > 0) && (
          <button onClick={() => { setSelectedCerts([]); setSelectedLocations([]) }}
            style={{ fontSize: 12, color: 'var(--muted2)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            Clear all filters
          </button>
        )}
      </div>

      {/* Middle: Supplier list */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line)', background: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>Find Suppliers</h2>
              <div style={{ fontSize: 13, color: 'var(--muted2)' }}>for <strong>{productName}</strong></div>
            </div>
          </div>
          {/* Tab toggle */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--line)', marginBottom: -1 }}>
            {([['recommended', 'Keychain Recommended'], ['network', 'In Network']] as const).map(([tab, label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 16px', fontSize: 13.5, fontWeight: activeTab === tab ? 600 : 400,
                  color: activeTab === tab ? 'var(--ink)' : 'var(--muted2)', background: 'none', border: 'none',
                  borderBottom: activeTab === tab ? '2px solid #FACC15' : '2px solid transparent',
                  cursor: 'pointer', marginBottom: -1,
                }}>
                {label}
                <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 600, background: 'var(--line)', borderRadius: 'var(--pill)', padding: '1px 6px', color: 'var(--muted)' }}>
                  {DEMO_SUPPLIERS.filter(s => tab === 'recommended' ? s.isKeychainRecommended : s.isInNetwork).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--line)', background: 'white' }}>
          <div style={{ position: 'relative', maxWidth: 360 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--placeholder)' }}>
              <NavIcon name="search" size={14} />
            </span>
            <input type="text" placeholder="Search suppliers..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '7px 12px 7px 32px', borderRadius: 'var(--r)', border: '1px solid var(--line)', fontSize: 13.5, outline: 'none' }} />
          </div>
        </div>

        {/* Supplier cards */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted2)', fontSize: 14 }}>No suppliers match your filters.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map(supplier => (
                <div key={supplier.id}
                  style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: '16px 20px', background: 'white', boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: supplier.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: supplier.color, flexShrink: 0 }}>
                      {supplier.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{supplier.name}</span>
                        {supplier.keychainPreferred && (
                          <span style={{ fontSize: 11, fontWeight: 600, background: '#FEF9C3', color: '#854D0E', borderRadius: 'var(--pill)', padding: '1px 7px' }}>Keychain Preferred</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--muted2)', marginBottom: 8 }}>
                        📍 {supplier.location} · {supplier.volume}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {supplier.certifications.map(c => (
                          <span key={c} style={{ fontSize: 11.5, fontWeight: 500, background: 'var(--bg-soft)', border: '1px solid var(--line)', borderRadius: 'var(--pill)', padding: '2px 8px', color: 'var(--muted)' }}>{c}</span>
                        ))}
                        {supplier.categories.map(c => (
                          <span key={c} style={{ fontSize: 11.5, fontWeight: 500, background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--pill)', padding: '2px 8px', color: '#1d4ed8' }}>{c}</span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleShortlist(supplier)}
                      style={{
                        padding: '7px 16px', borderRadius: 'var(--r-sm)', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                        background: isShortlisted(supplier.id) ? 'var(--ink)' : 'var(--yellow)',
                        color: isShortlisted(supplier.id) ? 'white' : 'var(--ink)',
                        border: 'none',
                      }}>
                      {isShortlisted(supplier.id) ? '✓ Shortlisted' : '+ Add to Shortlist'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Shortlist sidebar */}
      <div style={{ width: 260, flexShrink: 0, borderLeft: '1px solid var(--line)', display: 'flex', flexDirection: 'column', background: 'white' }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
            Shortlist <span style={{ fontSize: 12, fontWeight: 600, background: shortlisted.length > 0 ? 'var(--ink)' : 'var(--line)', color: shortlisted.length > 0 ? 'white' : 'var(--muted)', borderRadius: 'var(--pill)', padding: '1px 7px' }}>{shortlisted.length}</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted2)' }}>Add suppliers to shortlist, then post the project.</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {shortlisted.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--placeholder)', fontSize: 13, padding: '24px 0' }}>
              No suppliers shortlisted yet.
            </div>
          ) : (
            shortlisted.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: s.color, flexShrink: 0 }}>
                  {s.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted2)' }}>{s.location.split(',')[0]}</div>
                </div>
                <button onClick={() => toggleShortlist(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted2)', padding: 2 }}>
                  <NavIcon name="x" size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid var(--line)' }}>
          <button
            onClick={handlePostProject}
            disabled={shortlisted.length === 0 || posting}
            style={{
              width: '100%', padding: '10px', borderRadius: 'var(--r-sm)', border: 'none',
              background: shortlisted.length === 0 ? 'var(--line)' : 'var(--ink)',
              color: shortlisted.length === 0 ? 'var(--muted2)' : 'white',
              fontSize: 14, fontWeight: 600, cursor: shortlisted.length === 0 ? 'default' : 'pointer',
            }}>
            {posting ? 'Loading…' : 'Post a Project →'}
          </button>
          {shortlisted.length === 0 && (
            <div style={{ fontSize: 11.5, color: 'var(--placeholder)', textAlign: 'center', marginTop: 8 }}>Add at least one supplier to continue</div>
          )}
        </div>
      </div>
    </div>
  )
}
