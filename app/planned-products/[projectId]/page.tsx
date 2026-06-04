'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NavIcon } from '@/components/shell/NavIcon'
import { StatusPill } from '@/components/ui/StatusPill'

type Supplier = {
  id: string
  name: string
  logoInitials: string
  logoColor: string
  logoBg: string
  keychainPreferred: boolean
  addedBy: string
  addedByType: 'ai' | 'user'
  stage: string
  nextSteps: string[]
  pipelineStage: string
}

type ProjectDetail = {
  id: string
  name: string
  status: string
  type: string
  thumbnail: string
  date: string
  teamMembers: number
  suppliers: Supplier[]
}

const PIPELINE_STAGES = ['Shortlisted', 'Verification', 'NDA', 'RFI', 'Quick Bid']

// Derive a deterministic bg/color for the project initials square
function projectColor(name: string) {
  const palettes = [
    { bg: '#D1FAE5', color: '#065F46' },
    { bg: '#DBEAFE', color: '#1D4ED8' },
    { bg: '#FEF3C7', color: '#92400E' },
    { bg: '#F3E8FF', color: '#7E22CE' },
    { bg: '#FEE2E2', color: '#B91C1C' },
  ]
  const idx = (name.charCodeAt(0) || 65) % palettes.length
  return palettes[idx]
}

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Suppliers')
  const [aiBannerVisible, setAiBannerVisible] = useState(true)
  const [supplierSearch, setSupplierSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetch(`/api/projects/${params.projectId}`)
      .then(r => r.json())
      .then(data => { setProject(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.projectId])

  if (loading) return <div style={{ padding: 40, color: 'var(--muted2)' }}>Loading…</div>
  if (!project) return (
    <div style={{ padding: 40 }}>
      <Link href="/planned-products" style={{ color: '#2563EB', fontSize: 13, textDecoration: 'none' }}>
        ← All Projects
      </Link>
      <p style={{ marginTop: 16, color: 'var(--muted2)' }}>Project not found.</p>
    </div>
  )

  // Pipeline: count suppliers per stage
  const stagesWithCount: Record<string, number> = {}
  project.suppliers.forEach(s => {
    stagesWithCount[s.pipelineStage] = (stagesWithCount[s.pipelineStage] ?? 0) + 1
  })
  const shortlistedCount = project.suppliers.length

  // Filter suppliers
  const filteredSuppliers = project.suppliers.filter(s => {
    if (supplierSearch && !s.name.toLowerCase().includes(supplierSearch.toLowerCase())) return false
    if (statusFilter && s.stage !== statusFilter) return false
    return true
  })

  const uniqueStages = Array.from(new Set(project.suppliers.map(s => s.stage)))

  // Project initials (max 2 chars) + color
  const initials = project.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  const { bg: projBg, color: projColor } = projectColor(project.name)

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1200 }}>

      {/* Back link */}
      <Link
        href="/planned-products"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          color: '#6B7280',
          textDecoration: 'none',
          marginBottom: 20,
        }}
      >
        <NavIcon name="arrow-left" size={13} />
        All Projects
      </Link>

      {/* Project header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>

        {/* Project initials avatar — 56px square with rounded corners */}
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 10,
          background: projBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 17,
          fontWeight: 700,
          color: projColor,
          flexShrink: 0,
          border: `1px solid ${projColor}33`,
        }}>
          {initials}
        </div>

        {/* Title + meta */}
        <div style={{ flex: 1 }}>
          {/* Line 1: name + type pill inline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
              {project.name}
            </h1>
            <StatusPill label={project.type} />
          </div>
          {/* Line 2: Active pill · date · team · invite */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#6B7280', flexWrap: 'wrap' }}>
            <StatusPill label={project.status} />
            <span style={{ color: '#D1D5DB' }}>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <NavIcon name="calendar" size={13} />
              {project.date}
            </span>
            <span style={{ color: '#D1D5DB' }}>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <NavIcon name="users" size={13} />
              {project.teamMembers} Team Members
            </span>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              color: '#2563EB',
              fontWeight: 500,
              padding: 0,
            }}>
              <NavIcon name="user-plus" size={13} />
              Invite
            </button>
          </div>
        </div>

        {/* Options button — top right */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '7px 14px',
          border: '1px solid #D1D5DB',
          borderRadius: 6,
          background: 'white',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          color: 'var(--ink)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          Options
          <NavIcon name="chevron-down" size={13} />
        </button>
      </div>

      {/* Tab bar — yellow underline on active */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--line)', marginBottom: 24 }}>
        {['Timeline', 'Suppliers', 'Advanced Analysis ✨', 'Documents', 'Project Details'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '9px 18px',
              fontSize: 13.5,
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? 'var(--ink)' : '#6B7280',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #FACC15' : '2px solid transparent',
              cursor: 'pointer',
              marginBottom: -1,
              whiteSpace: 'nowrap',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab !== 'Suppliers' ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted2)', fontSize: 14 }}>
          {activeTab} content coming soon.
        </div>
      ) : (
        <>
          {/* All Suppliers header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>All Suppliers</h2>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              border: '1px solid #D1D5DB',
              borderRadius: 6,
              background: 'white',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              color: 'var(--ink)',
            }}>
              <NavIcon name="plus" size={13} />
              Add Supplier
            </button>
          </div>

          {/* Keychain AI banner */}
          {aiBannerVisible && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              padding: '14px 18px',
              background: '#FFFDF0',
              border: '1px solid #FDE047',
              borderRadius: 10,
              marginBottom: 20,
            }}>
              {/* Radio / pulse icon */}
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#FDE047',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {/* Radio waves icon */}
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#92660C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                  <span>Keychain AI</span>
                  {/* sparkle */}
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                  </svg>
                  <span>is searching for best-suited manufacturers.</span>
                </div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>
                  We'll share your project details with suppliers and notify you as soon as they respond.
                </div>
              </div>
              <button
                onClick={() => setAiBannerVisible(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: '#6B7280',
                  padding: '2px 4px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Hide
              </button>
            </div>
          )}

          {/* Pipeline stepper */}
          <div style={{
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: '24px 32px',
            marginBottom: 20,
            boxShadow: '0 1px 3px rgba(17,24,39,.06), 0 1px 2px rgba(17,24,39,.04)',
            background: 'white',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
              {/* Connecting line sits at the center of the circles (16px from top since circles are 32px) */}
              <div style={{
                position: 'absolute',
                top: 15,
                left: '10%',
                right: '10%',
                height: 1.5,
                background: '#E5E7EB',
                zIndex: 0,
              }} />

              {PIPELINE_STAGES.map((stage, idx) => {
                const count = stagesWithCount[stage] ?? 0
                const isFirst = idx === 0
                // First bubble is green-filled (shortlisted = done)
                // Rest are empty circles
                return (
                  <div
                    key={stage}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      zIndex: 1,
                      flex: 1,
                    }}
                  >
                    {/* Circle */}
                    <div style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isFirst ? '#16A34A' : 'white',
                      border: isFirst ? '2px solid #16A34A' : '2px solid #D1D5DB',
                      color: isFirst ? 'white' : '#9CA3AF',
                      fontSize: 13,
                      fontWeight: 600,
                    }}>
                      {isFirst ? (
                        /* checkmark */
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E5E7EB' }} />
                      )}
                    </div>
                    {/* Label + count below */}
                    <div style={{ textAlign: 'center', fontSize: 12.5, color: isFirst ? 'var(--ink)' : '#9CA3AF', fontWeight: isFirst ? 500 : 400 }}>
                      {stage}
                      {count > 0 && (
                        <span style={{ fontWeight: 600, color: isFirst ? '#16A34A' : '#9CA3AF', marginLeft: 4 }}>
                          {count}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Search + Status filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
                <NavIcon name="search" size={14} />
              </span>
              <input
                type="text"
                placeholder="Search Suppliers"
                value={supplierSearch}
                onChange={e => setSupplierSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 32px',
                  borderRadius: 8,
                  border: '1px solid var(--line)',
                  fontSize: 13.5,
                  outline: 'none',
                  color: 'var(--ink)',
                }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 32px 8px 12px',
                borderRadius: 8,
                border: '1px solid var(--line)',
                fontSize: 13.5,
                color: 'var(--ink)',
                background: 'white',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                flexShrink: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
            >
              <option value="">Status</option>
              {uniqueStages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Supplier table */}
          <div style={{
            border: '1px solid var(--line)',
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(17,24,39,.06), 0 1px 2px rgba(17,24,39,.04)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['Manufacturer', 'Added by', 'Current Status', 'Next Steps', ''].map((col, i) => (
                    <th key={i} style={{
                      padding: '10px 16px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#6B7280',
                      borderBottom: '1px solid var(--line)',
                      whiteSpace: 'nowrap',
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>
                      No suppliers found.
                    </td>
                  </tr>
                ) : filteredSuppliers.map((s, i) => (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom: i < filteredSuppliers.length - 1 ? '1px solid var(--line)' : 'none',
                      background: 'white',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                  >
                    {/* Manufacturer */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {/* Logo square */}
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: s.logoBg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                          color: s.logoColor,
                          flexShrink: 0,
                          border: '1px solid rgba(0,0,0,0.06)',
                        }}>
                          {s.logoInitials}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>
                            {s.name}
                            {/* sparkle */}
                            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                            </svg>
                          </div>
                          {s.keychainPreferred && (
                            <div style={{ fontSize: 11.5, color: '#9CA3AF', fontWeight: 400, marginTop: 1 }}>
                              Keychain Preferred
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Added by */}
                    <td style={{ padding: '14px 16px' }}>
                      {s.addedByType === 'ai' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          {/* Yellow "k" circle for Keychain AI */}
                          <div style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: '#FDE047',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            fontWeight: 800,
                            color: '#92660C',
                            flexShrink: 0,
                          }}>
                            k
                          </div>
                          <span style={{ fontSize: 13, color: 'var(--ink)' }}>{s.addedBy}</span>
                          <span style={{ cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center' }}>
                            <NavIcon name="info" size={13} />
                          </span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          {/* Dark avatar for user */}
                          <div style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: '#020817',
                            color: 'white',
                            fontSize: 9,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            letterSpacing: '0.02em',
                          }}>
                            ab
                          </div>
                          <span style={{ fontSize: 13, color: 'var(--ink)' }}>{s.addedBy}</span>
                        </div>
                      )}
                    </td>

                    {/* Current Status */}
                    <td style={{ padding: '14px 16px' }}>
                      <StatusPill label={s.stage} />
                    </td>

                    {/* Next Steps */}
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#6B7280' }}>
                      {s.nextSteps.map((step, si) => (
                        <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {step === 'Review Response' && (
                            <div style={{
                              width: 7,
                              height: 7,
                              borderRadius: '50%',
                              background: '#EF4444',
                              flexShrink: 0,
                            }} />
                          )}
                          {step}
                        </div>
                      ))}
                    </td>

                    {/* View Tasks */}
                    <td style={{ padding: '14px 16px' }}>
                      <Link
                        href={`/planned-products/${params.projectId}/tasks/${s.id}`}
                        style={{
                          display: 'inline-block',
                          padding: '7px 16px',
                          borderRadius: 6,
                          border: 'none',
                          background: '#020817',
                          color: 'white',
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: 'pointer',
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        View Tasks
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
