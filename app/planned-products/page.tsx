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

export default function PlannedProductsPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'all'>('all')
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
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

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchProducts() }, 300)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const totalPages = result ? Math.ceil(result.total / PAGE_SIZE) : 1

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200 }}>
      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>
          Planned Products
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--line)', marginBottom: 20 }}>
        {(['dashboard', 'all'] as const).map((tab) => (
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
              borderBottom: activeTab === tab ? '2px solid var(--yellow-press)' : '2px solid transparent',
              cursor: 'pointer',
              marginBottom: -1,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {tab === 'dashboard' ? 'Dashboard' : 'All Products'}
            {tab === 'all' && result && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  background: 'var(--line)',
                  borderRadius: 'var(--pill)',
                  padding: '1px 7px',
                  color: 'var(--muted)',
                }}
              >
                {result.total.toLocaleString()}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' ? (
        <DashboardTab />
      ) : (
        <>
          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            {/* Search */}
            <div style={{ flex: 1, maxWidth: 340, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--placeholder)' }}>
                <NavIcon name="search" size={14} />
              </span>
              <input
                type="text"
                placeholder="Search Planned Products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 32px',
                  borderRadius: 'var(--r)',
                  border: '1px solid var(--line)',
                  fontSize: 13.5,
                  color: 'var(--ink)',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ flex: 1 }} />

            {/* Filters */}
            {[
              { key: 'stage', label: 'Stage', value: stageFilter, options: result?.filters.stages ?? [], setter: setStageFilter },
              { key: 'brand', label: 'Brand', value: brandFilter, options: result?.filters.brands ?? [], setter: setBrandFilter },
              { key: 'category', label: 'Product Category', value: categoryFilter, options: result?.filters.categories ?? [], setter: setCategoryFilter },
            ].map(f => (
              <div key={f.key} style={{ position: 'relative' }}>
                <button
                  onClick={() => setOpenFilter(openFilter === f.key ? null : f.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 12px',
                    borderRadius: 'var(--r-sm)',
                    border: `1px solid ${f.value ? 'var(--ink)' : 'var(--line2)'}`,
                    background: f.value ? 'var(--ink)' : 'white',
                    color: f.value ? 'white' : 'var(--ink)',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {f.value || f.label}
                  {f.value ? (
                    <span onClick={e => { e.stopPropagation(); f.setter(''); setPage(1) }}>
                      <NavIcon name="x" size={13} />
                    </span>
                  ) : (
                    <NavIcon name="chevron-down" size={13} />
                  )}
                </button>
                {openFilter === f.key && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '110%',
                      right: 0,
                      minWidth: 160,
                      background: 'white',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--r)',
                      boxShadow: 'var(--shadow-card)',
                      zIndex: 50,
                      overflow: 'hidden',
                    }}
                  >
                    {f.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => { f.setter(opt); setPage(1); setOpenFilter(null) }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          width: '100%',
                          padding: '8px 14px',
                          fontSize: 13,
                          color: 'var(--ink)',
                          background: f.value === opt ? 'var(--bg-soft)' : 'white',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        {f.value === opt && <NavIcon name="check" size={13} />}
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
                    <th
                      key={col}
                      style={{
                        padding: '10px 16px',
                        textAlign: 'left',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--muted)',
                        borderBottom: '1px solid var(--line)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--muted2)' }}>
                      Loading…
                    </td>
                  </tr>
                ) : result?.data.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--muted2)' }}>
                      No products found.
                    </td>
                  </tr>
                ) : (
                  result?.data.map((product, i) => (
                    <tr
                      key={product.id}
                      style={{
                        borderBottom: i < (result.data.length - 1) ? '1px solid var(--line)' : 'none',
                        background: 'white',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                    >
                      {/* Product */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 8,
                              background: 'var(--bg-soft)',
                              overflow: 'hidden',
                              flexShrink: 0,
                              border: '1px solid var(--line)',
                            }}
                          >
                            <img
                              src={product.thumbnail}
                              alt={product.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          </div>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.3 }}>
                              {product.name}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 1 }}>
                              {product.brand} · {product.category}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Stage */}
                      <td style={{ padding: '12px 16px' }}>
                        {product.stage ? <StatusPill label={product.stage} /> : (
                          <span style={{ color: 'var(--placeholder)', fontSize: 13 }}>—</span>
                        )}
                      </td>

                      {/* Suppliers */}
                      <td style={{ padding: '12px 16px' }}>
                        {product.suppliersActive > 0 || product.suppliersShortlisted > 0 ? (
                          <div style={{ fontSize: 13 }}>
                            <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{product.suppliersActive} Active</span>
                            <span style={{ color: 'var(--muted2)', marginLeft: 4 }}>/ {product.suppliersShortlisted} Shortlisted</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--placeholder)', fontSize: 13 }}>—</span>
                        )}
                      </td>

                      {/* Next Step */}
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--muted)', maxWidth: 220 }}>
                        {product.nextStep}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 16px' }}>
                        {product.projectId ? (
                          <Link
                            href={`/planned-products/${product.projectId}`}
                            style={{
                              padding: '6px 14px',
                              border: '1px solid var(--line2)',
                              borderRadius: 'var(--r-sm)',
                              fontSize: 13,
                              fontWeight: 500,
                              color: 'var(--ink)',
                              background: 'white',
                              textDecoration: 'none',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            View Details
                          </Link>
                        ) : (
                          <Link
                            href={`/post-project/${product.id}`}
                            style={{
                              padding: '6px 14px',
                              borderRadius: 'var(--r-sm)',
                              fontSize: 13,
                              fontWeight: 500,
                              color: 'var(--ink)',
                              background: 'var(--yellow)',
                              textDecoration: 'none',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Find Suppliers
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 20 }}>
              <PaginationBtn label="← Previous" disabled={page === 1} onClick={() => setPage(p => p - 1)} />
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                <PaginationBtn key={p} label={String(p)} active={p === page} onClick={() => setPage(p)} />
              ))}
              {totalPages > 7 && <span style={{ padding: '0 4px', color: 'var(--muted2)' }}>…</span>}
              {totalPages > 7 && <PaginationBtn label={String(totalPages)} active={page === totalPages} onClick={() => setPage(totalPages)} />}
              <PaginationBtn label="Next →" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

function PaginationBtn({ label, active, disabled, onClick }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '6px 11px',
        borderRadius: 'var(--r-sm)',
        border: '1px solid var(--line)',
        background: active ? 'var(--yellow)' : 'white',
        color: active ? 'var(--ink)' : disabled ? 'var(--placeholder)' : 'var(--ink)',
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      {label}
    </button>
  )
}

function DashboardTab() {
  return (
    <div style={{ padding: '40px 0', color: 'var(--muted2)', textAlign: 'center', fontSize: 14 }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
      Dashboard view — sourcing pipeline overview coming soon.
      <br />
      <button
        style={{ marginTop: 16, padding: '8px 20px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)', background: 'white', fontSize: 13, cursor: 'pointer' }}
        // @ts-ignore
        onClick={() => document.querySelector('[data-tab="all"]')?.click()}
      >
        View All Products →
      </button>
    </div>
  )
}
