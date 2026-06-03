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

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Suppliers')
  const [aiBannerVisible, setAiBannerVisible] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/projects/${params.projectId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setProject(data)
        setLoading(false)
      })
      .catch(() => { setError('Failed to load project'); setLoading(false) })
  }, [params.projectId])

  if (loading) return <div style={{ padding: 40, color: 'var(--muted2)' }}>Loading…</div>
  if (error || !project) return <div style={{ padding: 40 }}>
    <Link href="/planned-products" style={{ color: 'var(--blue)', fontSize: 13 }}>← All Products</Link>
    <p style={{ marginTop: 16, color: 'var(--muted2)' }}>Project not found.</p>
  </div>

  // Pipeline position
  const stagesWithCount: Record<string, number> = {}
  project.suppliers.forEach(s => {
    stagesWithCount[s.pipelineStage] = (stagesWithCount[s.pipelineStage] ?? 0) + 1
  })

  const highestStageIdx = PIPELINE_STAGES.reduce((maxIdx, stage, idx) => {
    return stagesWithCount[stage] ? idx : maxIdx
  }, 0)

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1200 }}>
      {/* Back link */}
      <Link
        href="/planned-products"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)', textDecoration: 'none', marginBottom: 16 }}
      >
        <NavIcon name="arrow-left" size={14} />
        All Projects
      </Link>

      {/* Project header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--r)',
            background: 'var(--bg-soft)',
            border: '1px solid var(--line)',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <img src={project.thumbnail} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>{project.name}</h1>
            <StatusPill label={project.type} />
            <StatusPill label={project.status} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--muted2)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <NavIcon name="calendar" size={13} /> {project.date}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <NavIcon name="users" size={13} /> {project.teamMembers} Team Members
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1px solid var(--line2)', borderRadius: 'var(--r-sm)', background: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            <NavIcon name="user-plus" size={13} /> Invite
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 14px', border: '1px solid var(--line2)', borderRadius: 'var(--r-sm)', background: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            Options <NavIcon name="chevron-down" size={13} />
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--line)', marginBottom: 24 }}>
        {['Timeline', 'Suppliers', 'Advanced Analysis ✨', 'Documents', 'Project Details'].map(tab => (
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
            <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)' }}>All Suppliers</h2>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                border: '1px solid var(--line2)',
                borderRadius: 'var(--r-sm)',
                background: 'white',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <NavIcon name="plus" size={13} /> Add Supplier
            </button>
          </div>

          {/* Keychain AI banner */}
          {aiBannerVisible && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 16px',
                background: '#FFFDF0',
                border: '1px solid var(--yellow-press)',
                borderRadius: 'var(--r)',
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 18, marginTop: 1 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                  <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>
                  Keychain AI is searching for best-suited manufacturers.
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted2)' }}>
                  Based on your product specifications, Keychain AI is identifying and shortlisting the most capable suppliers for your review.
                </div>
              </div>
              <button
                onClick={() => setAiBannerVisible(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted2)', fontSize: 12, fontWeight: 500, padding: '2px 4px' }}
              >
                Hide
              </button>
            </div>
          )}

          {/* Pipeline stepper */}
          <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: '20px 24px', marginBottom: 20, boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {/* connector line */}
              <div style={{ position: 'absolute', top: 16, left: '10%', right: '10%', height: 2, background: 'var(--line)', zIndex: 0 }} />
              {PIPELINE_STAGES.map((stage, idx) => {
                const count = stagesWithCount[stage] ?? 0
                const completed = idx < highestStageIdx
                const current = idx === highestStageIdx
                return (
                  <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 1, flex: 1 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: completed ? 'var(--green)' : current ? 'var(--ink)' : 'white',
                        border: completed ? '2px solid var(--green)' : current ? '2px solid var(--ink)' : '2px solid var(--line)',
                        color: completed || current ? 'white' : 'var(--muted)',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {completed ? <NavIcon name="check" size={14} /> : idx + 1}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 12.5, fontWeight: current ? 600 : 400, color: current ? 'var(--ink)' : 'var(--muted2)' }}>
                        {stage} {count > 0 && `(${count})`}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Supplier table */}
          <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-soft)' }}>
                  {['Manufacturer', 'Added by', 'Current Status', 'Next Steps', ''].map((col, i) => (
                    <th key={i} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', borderBottom: '1px solid var(--line)' }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {project.suppliers.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--muted2)' }}>
                      No suppliers yet. Click &quot;Add Supplier&quot; to get started.
                    </td>
                  </tr>
                ) : (
                  project.suppliers.map((s, i) => (
                    <tr
                      key={s.id}
                      style={{ borderBottom: i < project.suppliers.length - 1 ? '1px solid var(--line)' : 'none', background: 'white' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                    >
                      {/* Manufacturer */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
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
                            }}
                          >
                            {s.logoInitials}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>
                              {s.name}
                              {s.keychainPreferred && (
                                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                                </svg>
                              )}
                            </div>
                            {s.keychainPreferred && (
                              <div style={{ fontSize: 11, color: '#ca8a04', fontWeight: 500 }}>Keychain Preferred</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Added by */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted2)' }}>
                          {s.addedByType === 'ai' ? (
                            <>
                              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                              </svg>
                              {s.addedBy}
                            </>
                          ) : (
                            <>
                              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--ink)', color: 'white', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                AS
                              </div>
                              {s.addedBy}
                            </>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 16px' }}>
                        <StatusPill label={s.stage} />
                      </td>

                      {/* Next Steps */}
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--muted)' }}>
                        {s.nextSteps.map((step, si) => (
                          <div key={si}>• {step}</div>
                        ))}
                      </td>

                      {/* View Tasks */}
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          style={{
                            padding: '6px 14px',
                            borderRadius: 'var(--r-sm)',
                            border: 'none',
                            background: 'var(--ink)',
                            color: 'white',
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          View Tasks
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
