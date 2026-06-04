'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { NavIcon } from '@/components/shell/NavIcon'
import { StatusPill } from '@/components/ui/StatusPill'

type Product = {
  id: string
  name: string
  brand: string
  category: string
  thumbnail: string
  stage: string | null
  projectId: string | null
  suppliersActive: number
  suppliersShortlisted: number
  nextStep: string
}

type ApiResponse = {
  data: Product[]
  total: number
  filters: { stages: string[]; brands: string[]; categories: string[] }
}

const PAGE_SIZE = 10

// ─── Pending data (seeded demo) ──────────────────────────────────────────────
const PENDING_ON_YOU = [
  { id: 1, action: 'Project Data Collection', product: '2% Reduced Fat Milk', stage: 'Data Collection', thumbnail: 'https://images.openfoodfacts.org/images/products/004/631/003/0004/front_en.27.400.jpg' },
  { id: 2, action: 'Message Supplier', product: '2% Reduced Fat Milk', stage: 'Verification', thumbnail: 'https://images.openfoodfacts.org/images/products/004/631/003/0004/front_en.27.400.jpg' },
  { id: 3, action: 'Send Intro', product: '2% Reduced Fat Milk', stage: 'Verification', thumbnail: 'https://images.openfoodfacts.org/images/products/004/631/003/0004/front_en.27.400.jpg' },
  { id: 4, action: 'Send Intro', product: '2% Reduced Fat Milk', stage: 'Verification', thumbnail: 'https://images.openfoodfacts.org/images/products/004/631/003/0004/front_en.27.400.jpg' },
  { id: 5, action: 'Send Intro', product: '2% Reduced Fat Milk', stage: 'Verification', thumbnail: 'https://images.openfoodfacts.org/images/products/004/631/003/0004/front_en.27.400.jpg' },
]

const PENDING_FROM_SUPPLIERS = [
  { id: 1, label: 'Awaiting Response', product: 'Amazon - 100% Natural Spring Water', stage: 'NDA', thumbnail: 'https://images.openfoodfacts.org/images/products/001/600/001/7007/front_en.3.400.jpg' },
  { id: 2, label: 'Awaiting Response', product: 'Finely Shredded Iceberg Lettuce', stage: 'Verification', thumbnail: 'https://images.openfoodfacts.org/images/products/003/003/400/3003/front_en.4.400.jpg' },
  { id: 3, label: 'Awaiting Response', product: 'Grape', stage: 'Data Collection', thumbnail: 'https://images.openfoodfacts.org/images/products/007/619/400/5030/front_en.5.400.jpg' },
  { id: 4, label: 'Awaiting Response', product: 'Grape', stage: 'Data Collection', thumbnail: 'https://images.openfoodfacts.org/images/products/007/619/400/5030/front_en.5.400.jpg' },
  { id: 5, label: 'Awaiting Response', product: 'Amazon - Real Mayonnaise', stage: 'Data Collection', thumbnail: 'https://images.openfoodfacts.org/images/products/008/113/001/2770/front_en.3.400.jpg' },
]

export default function PlannedProductsPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'all'>('dashboard')
  const [dashboardView, setDashboardView] = useState<'all' | 'my'>('all')
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [openFilter, setOpenFilter] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (stageFilter) params.set('stage', stageFilter)
    if (brandFilter) params.set('brand', brandFilter)
    if (categoryFilter) params.set('category', categoryFilter)
    params.set('page', String(page))
    params.set('pageSize', String(PAGE_SIZE))
    const res = await fetch(`/api/products?${params}`)
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }, [search, stageFilter, brandFilter, categoryFilter, page])

  useEffect(() => {
    if (activeTab === 'all') fetchProducts()
  }, [fetchProducts, activeTab])

  useEffect(() => {
    if (activeTab !== 'all') return
    const t = setTimeout(() => { setPage(1) }, 300)
    return () => clearTimeout(t)
  }, [search, activeTab])

  const totalPages = result ? Math.ceil(result.total / PAGE_SIZE) : 1

  return (
    <div style={{ padding: '28px 32px' }}>
      {/* Page header */}
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 20 }}>
        Planned Products
      </h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--line)', marginBottom: 24 }}>
        {([['dashboard', 'Dashboard'], ['all', 'All Products']] as const).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '9px 18px',
              fontSize: 13.5,
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? 'var(--ink)' : 'var(--muted2)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #FACC15' : '2px solid transparent',
              cursor: 'pointer',
              marginBottom: -1,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {label}
            {tab === 'all' && result && (
              <span style={{ fontSize: 11, fontWeight: 600, background: 'var(--line)', borderRadius: 'var(--pill)', padding: '1px 7px', color: 'var(--muted)' }}>
                {result.total >= 1000 ? `${(result.total / 1000).toFixed(1)}K` : result.total}
              </span>
            )}
            {tab === 'all' && !result && (
              <span style={{ fontSize: 11, fontWeight: 600, background: 'var(--line)', borderRadius: 'var(--pill)', padding: '1px 7px', color: 'var(--muted)' }}>1.8K</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' ? (
        <DashboardTab view={dashboardView} setView={setDashboardView} />
      ) : (
        <AllProductsTab
          search={search} setSearch={setSearch}
          stageFilter={stageFilter} setStageFilter={setStageFilter}
          brandFilter={brandFilter} setBrandFilter={setBrandFilter}
          categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
          page={page} setPage={setPage}
          result={result} loading={loading}
          totalPages={totalPages}
          openFilter={openFilter} setOpenFilter={setOpenFilter}
        />
      )}
    </div>
  )
}

// ─── Dashboard Tab ─────────────────────────────────────────────────────────────
function DashboardTab({ view, setView }: { view: 'all' | 'my'; setView: (v: 'all' | 'my') => void }) {
  const METRICS = [
    { label: 'Total Planned Products', value: '1,772' },
    { label: 'Products with Suppliers Shortlisted', value: '375' },
    { label: 'Projects Posted', value: '331' },
    { label: 'Projects Completed', value: '21' },
  ]

  return (
    <div>
      {/* All Products / My Products toggle */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24 }}>
        {(['all', 'my'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: '6px 18px',
              fontSize: 13,
              fontWeight: 500,
              background: view === v ? 'white' : 'transparent',
              border: '1px solid var(--line)',
              borderRadius: v === 'all' ? '8px 0 0 8px' : '0 8px 8px 0',
              marginLeft: v === 'my' ? -1 : 0,
              cursor: 'pointer',
              color: view === v ? 'var(--ink)' : 'var(--muted2)',
              boxShadow: view === v ? 'var(--shadow-card)' : 'none',
            }}
          >
            {v === 'all' ? 'All Products' : 'My Products'}
          </button>
        ))}
      </div>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: 24, boxShadow: 'var(--shadow-card)' }}>
        {METRICS.map((m, i) => (
          <div
            key={m.label}
            style={{
              padding: '24px 28px',
              borderRight: i < METRICS.length - 1 ? '1px solid var(--line)' : 'none',
              background: 'white',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 400 }}>{m.label}</span>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--muted2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Pending columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Pending on You */}
        <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Pending on You</span>
            <span style={{ fontSize: 12, fontWeight: 600, background: '#F3F4F6', borderRadius: 'var(--pill)', padding: '2px 8px', color: 'var(--muted)' }}>174</span>
          </div>
          {PENDING_ON_YOU.map((item, i) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 20px',
                borderBottom: i < PENDING_ON_YOU.length - 1 ? '1px solid var(--line)' : 'none',
                background: 'white',
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-soft)', border: '1px solid var(--line)', overflow: 'hidden', flexShrink: 0 }}>
                <img src={item.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>{item.action}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted2)' }}>
                  {item.product}
                  <StatusPill label={item.stage} />
                </div>
              </div>
              <button style={{ padding: '6px 14px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line2)', background: 'white', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', color: 'var(--ink)' }}>
                Take Action
              </button>
            </div>
          ))}
        </div>

        {/* Pending from Suppliers */}
        <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Pending from Suppliers</span>
            <span style={{ fontSize: 12, fontWeight: 600, background: '#F3F4F6', borderRadius: 'var(--pill)', padding: '2px 8px', color: 'var(--muted)' }}>43</span>
          </div>
          {PENDING_FROM_SUPPLIERS.map((item, i) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 20px',
                borderBottom: i < PENDING_FROM_SUPPLIERS.length - 1 ? '1px solid var(--line)' : 'none',
                background: 'white',
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-soft)', border: '1px solid var(--line)', overflow: 'hidden', flexShrink: 0 }}>
                <img src={item.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>{item.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted2)', flexWrap: 'wrap' }}>
                  {item.product}
                  <StatusPill label={item.stage} />
                </div>
              </div>
              <button style={{ padding: '6px 14px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line2)', background: 'white', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', color: 'var(--ink)' }}>
                Send Message
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── All Products Tab ──────────────────────────────────────────────────────────
function AllProductsTab({
  search, setSearch, stageFilter, setStageFilter, brandFilter, setBrandFilter,
  categoryFilter, setCategoryFilter, page, setPage, result, loading,
  totalPages, openFilter, setOpenFilter,
}: any) {
  return (
    <>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--placeholder)' }}>
            <NavIcon name="search" size={14} />
          </span>
          <input
            type="text"
            placeholder="Search Planned Products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '7px 12px 7px 32px', borderRadius: 'var(--r)', border: '1px solid var(--line)', fontSize: 13.5, color: 'var(--ink)', outline: 'none' }}
          />
        </div>
        <div style={{ flex: 1 }} />
        {[
          { key: 'stage', label: 'Stage', value: stageFilter, options: result?.filters.stages ?? [], setter: setStageFilter },
          { key: 'brand', label: 'Brand', value: brandFilter, options: result?.filters.brands ?? [], setter: setBrandFilter },
          { key: 'category', label: 'Product Category', value: categoryFilter, options: result?.filters.categories ?? [], setter: setCategoryFilter },
        ].map(f => (
          <div key={f.key} style={{ position: 'relative' }}>
            <button
              onClick={() => setOpenFilter(openFilter === f.key ? null : f.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
                borderRadius: 'var(--r-sm)', border: `1px solid ${f.value ? 'var(--ink)' : 'var(--line2)'}`,
                background: f.value ? 'var(--ink)' : 'white', color: f.value ? 'white' : 'var(--ink)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}
            >
              {f.value || f.label}
              {f.value ? (
                <span onClick={e => { e.stopPropagation(); f.setter(''); }}>
                  <NavIcon name="x" size={12} />
                </span>
              ) : <NavIcon name="chevron-down" size={13} />}
            </button>
            {openFilter === f.key && (
              <div style={{ position: 'absolute', top: '110%', right: 0, minWidth: 160, background: 'white', border: '1px solid var(--line)', borderRadius: 'var(--r)', boxShadow: 'var(--shadow-card)', zIndex: 50 }}>
                {f.options.map((opt: string) => (
                  <button key={opt} onClick={() => { f.setter(opt); setOpenFilter(null) }}
                    style={{ display: 'block', width: '100%', padding: '8px 14px', fontSize: 13, color: 'var(--ink)', background: f.value === opt ? 'var(--bg-soft)' : 'white', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-soft)' }}>
              {['Products', 'Stage', 'Suppliers', 'Next Step', 'Actions'].map(col => (
                <th key={col} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', borderBottom: '1px solid var(--line)' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--muted2)' }}>Loading…</td></tr>
            ) : result?.data.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--muted2)' }}>No products found.</td></tr>
            ) : result?.data.map((product: Product, i: number) => (
              <tr key={product.id}
                style={{ borderBottom: i < result.data.length - 1 ? '1px solid var(--line)' : 'none', background: 'white' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
              >
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-soft)', border: '1px solid var(--line)', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={product.thumbnail} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    </div>
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>{product.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {product.stage ? <StatusPill label={product.stage} /> : <span style={{ color: 'var(--placeholder)', fontSize: 13 }}>--</span>}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>
                  {product.suppliersActive > 0 || product.suppliersShortlisted > 0 ? (
                    <div>
                      <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{product.suppliersActive} Active</span>
                      <br /><span style={{ color: 'var(--muted2)' }}>{product.suppliersShortlisted} Shortlisted</span>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--muted2)' }}>{product.suppliersShortlisted} Shortlisted</span>
                  )}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--muted)' }}>{product.nextStep}</td>
                <td style={{ padding: '12px 16px' }}>
                  {product.projectId ? (
                    <Link href={`/planned-products/${product.projectId}`}
                      style={{ padding: '6px 14px', border: '1px solid var(--line2)', borderRadius: 'var(--r-sm)', fontSize: 13, fontWeight: 500, color: 'var(--ink)', background: 'white', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                      View Details
                    </Link>
                  ) : (
                    <Link href={`/find-suppliers/${product.id}`}
                      style={{ padding: '6px 14px', borderRadius: 'var(--r-sm)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', background: 'var(--yellow)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                      Find Suppliers
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 20 }}>
          <PaginationBtn label="← Previous" disabled={page === 1} onClick={() => setPage((p: number) => p - 1)} />
          {Array.from({ length: Math.min(8, totalPages) }, (_, i) => i + 1).map((p: number) => (
            <PaginationBtn key={p} label={String(p)} active={p === page} onClick={() => setPage(p)} />
          ))}
          {totalPages > 8 && <span style={{ padding: '0 4px', color: 'var(--muted2)' }}>…</span>}
          {totalPages > 8 && <PaginationBtn label={String(totalPages)} active={page === totalPages} onClick={() => setPage(totalPages)} />}
          <PaginationBtn label="Next →" disabled={page === totalPages} onClick={() => setPage((p: number) => p + 1)} />
        </div>
      )}
    </>
  )
}

function PaginationBtn({ label, active, disabled, onClick }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ padding: '6px 11px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)', background: active ? 'var(--yellow)' : 'white', color: active ? 'var(--ink)' : disabled ? 'var(--placeholder)' : 'var(--ink)', fontSize: 13, fontWeight: active ? 600 : 400, cursor: disabled ? 'default' : 'pointer' }}>
      {label}
    </button>
  )
}
