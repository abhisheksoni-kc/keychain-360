'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NavIcon } from '@/components/shell/NavIcon'

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

type Project = { id: string; name: string }

const PIPELINE_STAGES = ['Shortlisted', 'Verification', 'NDA', 'RFI', 'Quick Bid']

const KEYCHAIN_ANALYSIS = {
  volume: true,
  packaging: 'warning' as 'warning',
  criteria: [
    { label: 'Offers white label', pass: true },
    { label: 'Works with UNFI', pass: true },
    { label: 'Recall-free last 3 years', pass: true },
    { label: 'All natural ingredients', pass: false },
    { label: 'GFSI Certifications', pass: true },
    { label: 'Sourcing Standards', pass: false },
  ],
}

export default function ViewTasksPage({
  params,
}: {
  params: { projectId: string; supplierId: string }
}) {
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [taskExpanded, setTaskExpanded] = useState(true)
  const [analysisExpanded, setAnalysisExpanded] = useState(true)
  const [confirmed, setConfirmed] = useState(false)

  const currentStageIdx = 1 // Verification

  useEffect(() => {
    Promise.all([
      fetch(`/api/suppliers/${params.supplierId}`).then(r => r.json()),
      fetch(`/api/projects/${params.projectId}`).then(r => r.json()),
    ]).then(([s, p]) => {
      setSupplier(s.error ? null : s)
      setProject(p.error ? null : p)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [params.supplierId, params.projectId])

  if (loading) return <div style={{ padding: 40, color: 'var(--muted2)', fontSize: 14 }}>Loading…</div>

  const supplierName = supplier?.name ?? 'Supplier'
  const supplierInitials = supplier?.logoInitials ?? 'S'
  const supplierColor = supplier?.logoColor ?? '#1d4ed8'
  const supplierBg = supplier?.logoBg ?? '#dbeafe'
  const projectName = project?.name ?? 'Project'

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* ── Left panel ─────────────────────────────────────────────────────────── */}
      <div style={{ width: 340, flexShrink: 0, borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', background: 'white', overflow: 'hidden' }}>
        {/* View Project link */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)' }}>
          <Link href={`/planned-products/${params.projectId}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted2)', textDecoration: 'none' }}>
            <NavIcon name="arrow-left" size={13} /> View Project
          </Link>
        </div>

        {/* Supplier info */}
        <div style={{ padding: '20px 20px 16px' }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: supplierBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: supplierColor, marginBottom: 12, border: `1px solid ${supplierColor}30` }}>
            {supplierInitials}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{supplierName}</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted2)', marginBottom: 16 }}>
            Project
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, color: 'var(--muted)', fontSize: 12.5 }}>
              <span style={{ color: 'var(--muted2)' }}>↳</span> {projectName}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 12px', border: '1px solid var(--line2)', borderRadius: 'var(--r-sm)', background: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: 'var(--ink)' }}>
              <NavIcon name="file-text" size={13} /> Add Note
            </button>
            <button style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--line2)', borderRadius: 'var(--r-sm)', background: 'white', cursor: 'pointer', color: 'var(--muted2)' }}>
              <NavIcon name="more-horizontal" size={15} />
            </button>
          </div>
        </div>

        {/* Keychain Analysis section */}
        <div style={{ padding: '0 20px 16px' }}>
          <button
            onClick={() => setAnalysisExpanded(!analysisExpanded)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', textAlign: 'left' }}>
            <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            </svg>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', flex: 1 }}>Keychain Analysis</span>
            <NavIcon name={analysisExpanded ? 'chevron-down' : 'chevron-right'} size={13} />
          </button>
        </div>

        <div style={{ borderTop: '1px solid var(--line)', flex: 1, overflowY: 'auto' }}>
          {/* Vertical pipeline */}
          <div style={{ padding: '20px 20px' }}>
            {PIPELINE_STAGES.map((stage, idx) => {
              const completed = idx < currentStageIdx
              const current = idx === currentStageIdx
              const future = idx > currentStageIdx
              return (
                <div key={stage} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: idx < PIPELINE_STAGES.length - 1 ? 0 : 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: completed ? '#15803D' : current ? 'white' : 'white',
                      border: completed ? '2px solid #15803D' : current ? '2.5px solid var(--ink)' : '2px solid var(--line2)',
                      zIndex: 1,
                    }}>
                      {completed ? (
                        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : current ? (
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--ink)' }} />
                      ) : null}
                    </div>
                    {idx < PIPELINE_STAGES.length - 1 && (
                      <div style={{ width: 2, height: 32, background: completed ? '#15803D' : 'var(--line)', marginTop: 2, marginBottom: 2 }} />
                    )}
                  </div>
                  <div style={{ paddingTop: 3, paddingBottom: idx < PIPELINE_STAGES.length - 1 ? 32 : 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: current ? 600 : 400, color: future ? 'var(--muted2)' : 'var(--ink)' }}>
                      {stage}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 36px', background: '#FAFAFA' }}>
        {/* Stage heading */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
            {PIPELINE_STAGES[currentStageIdx]}
          </h2>
          <div style={{ fontSize: 13, color: 'var(--muted2)' }}>Due on Jun 06</div>
        </div>

        {/* Task: Keychain Capability Verification */}
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', marginBottom: 16 }}>
          <button
            onClick={() => setTaskExpanded(!taskExpanded)}
            style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--line2)', flexShrink: 0, marginTop: 2, background: 'white' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>Keychain Capability Verification</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted2)' }}>
                Supplier assessment for this project · Received on May 28, 5:05 PM
              </div>
            </div>
            <NavIcon name={taskExpanded ? 'chevron-down' : 'chevron-right'} size={16} />
          </button>

          {taskExpanded && (
            <div style={{ borderTop: '1px solid var(--line)', padding: '20px' }}>
              {/* Keychain Analysis card */}
              <div style={{ background: '#FFFDF0', border: '1px solid #FDE047', borderRadius: 'var(--r)', padding: '16px', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                  </svg>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>Keychain Analysis</span>
                </div>

                {/* Volume + Packaging */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>Volume</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>!</div>
                    <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>Packaging</span>
                  </div>
                </div>

                {/* Supplier Specific Criteria */}
                <div style={{ borderTop: '1px solid #FDE047', paddingTop: 14 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                    Supplier Specific Criteria
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {KEYCHAIN_ANALYSIS.criteria.map(c => (
                      <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                          background: c.pass ? '#15803D' : '#EF4444',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {c.pass ? (
                            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          ) : (
                            <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          )}
                        </div>
                        <span style={{ fontSize: 13, color: 'var(--ink)' }}>{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#FDE047', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#92660C' }}>k</div>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>Additional Notes <span style={{ color: '#EF4444' }}>*</span></span>
                </div>
                <div style={{ padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 'var(--r)', background: 'var(--bg-soft)', fontSize: 13, color: 'var(--placeholder)' }}>
                  No text provided
                </div>
              </div>

              {/* Action buttons */}
              {!confirmed ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    onClick={() => setConfirmed(true)}
                    style={{ padding: '10px 24px', borderRadius: 'var(--r-sm)', border: 'none', background: 'var(--yellow)', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--ink)' }}>
                    Confirm Supplier
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 'var(--r-sm)', border: '1px solid var(--line2)', background: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer', color: 'var(--muted)' }}>
                    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                    Disqualify Supplier
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: '#E7F5EC', border: '1px solid #BBF7D0', borderRadius: 'var(--r)', fontSize: 13.5, fontWeight: 500, color: '#15803D' }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Supplier confirmed — moving to NDA stage.
                </div>
              )}

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
                <button style={{ fontSize: 13.5, color: 'var(--muted2)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Message Supplier</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
