'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NavIcon } from '@/components/shell/NavIcon'
import { StatusPill } from '@/components/ui/StatusPill'

type Product = {
  id: string
  name: string
  brand: string
  category: string
  thumbnail: string
}

const WIZARD_STEPS = [
  { id: 'details', label: 'Product Details', description: 'Confirm product specs' },
  { id: 'requirements', label: 'Requirements', description: 'Set manufacturing requirements' },
  { id: 'invite', label: 'Invite Suppliers', description: 'Choose who to invite' },
  { id: 'review', label: 'Review & Post', description: 'Post your project' },
]

const MANUFACTURING_PROCESSES = ['Weigher', 'Depositor', 'Extruder', 'Mixer', 'Packager', 'Blender', 'Cutter', 'Wrapper']
const PACKAGING_MATERIALS = ['Box', 'Bag', 'Can', 'Bottle', 'Pouch', 'Wrapper', 'Tray', 'Jar']

export default function PostProjectPage({ params }: { params: { productId: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Form state
  const [form, setForm] = useState({
    projectName: '',
    quantity: '',
    targetPrice: '',
    timeline: '',
    certifications: [] as string[],
    notes: '',
    inviteAll: true,
    lookingFor: 'manufacturer',
  })

  useEffect(() => {
    fetch(`/api/products/${params.productId}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data)
        setForm(f => ({ ...f, projectName: data.name }))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.productId])

  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100

  async function handleSubmit() {
    if (!product) return
    setSubmitting(true)

    // Create project via API
    const projectRes = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        name: form.projectName || product.name,
        status: 'Active',
        type: 'Planned Product',
        thumbnail: product.thumbnail,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        teamMembers: 1,
        supplierIds: [],
      }),
    })
    const project = await projectRes.json()

    // Update product with projectId and stage
    await fetch(`/api/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: project.id, stage: 'Quick Bid', nextStep: 'Awaiting Response' }),
    })

    setSubmitting(false)
    setSubmitted(true)

    setTimeout(() => {
      router.push(`/planned-products/${project.id}`)
    }, 2000)
  }

  if (loading) return <div style={{ padding: 40, color: 'var(--muted2)' }}>Loading…</div>

  if (submitted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 40 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--green)' }}>
            <NavIcon name="check-circle" size={32} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>Project Posted!</h2>
          <p style={{ fontSize: 14, color: 'var(--muted2)' }}>Redirecting to your project…</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top progress bar */}
      <div style={{ height: 4, background: 'var(--line)' }}>
        <div
          style={{
            height: '100%',
            background: 'var(--yellow)',
            width: `${progress}%`,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: wizard form */}
        <div style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
          {/* Step nav */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
            {WIZARD_STEPS.map((step, idx) => (
              <div
                key={step.id}
                style={{ display: 'flex', alignItems: 'center', gap: 0 }}
              >
                <button
                  onClick={() => idx < currentStep && setCurrentStep(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 0',
                    background: 'none',
                    border: 'none',
                    cursor: idx < currentStep ? 'pointer' : 'default',
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 600,
                      background: idx < currentStep ? 'var(--green)' : idx === currentStep ? 'var(--yellow)' : 'var(--line)',
                      color: idx < currentStep ? 'white' : 'var(--ink)',
                    }}
                  >
                    {idx < currentStep ? <NavIcon name="check" size={12} /> : idx + 1}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: idx === currentStep ? 600 : 400, color: idx === currentStep ? 'var(--ink)' : 'var(--muted2)' }}>
                    {step.label}
                  </span>
                </button>
                {idx < WIZARD_STEPS.length - 1 && (
                  <div style={{ width: 32, height: 1, background: 'var(--line)', margin: '0 8px' }} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div>
            {currentStep === 0 && (
              <StepDetails form={form} setForm={setForm} productName={product?.name ?? ''} />
            )}
            {currentStep === 1 && (
              <StepRequirements form={form} setForm={setForm} />
            )}
            {currentStep === 2 && (
              <StepInvite form={form} setForm={setForm} />
            )}
            {currentStep === 3 && (
              <StepReview form={form} product={product} />
            )}
          </div>

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 36, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
            <button
              onClick={() => currentStep > 0 ? setCurrentStep(s => s - 1) : router.push('/planned-products')}
              style={{
                padding: '9px 22px',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--line2)',
                background: 'white',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                color: 'var(--ink)',
              }}
            >
              {currentStep === 0 ? 'Cancel' : '← Back'}
            </button>
            {currentStep < WIZARD_STEPS.length - 1 ? (
              <button
                onClick={() => setCurrentStep(s => s + 1)}
                style={{
                  padding: '9px 22px',
                  borderRadius: 'var(--r-sm)',
                  border: 'none',
                  background: 'var(--yellow)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--ink)',
                }}
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: '9px 22px',
                  borderRadius: 'var(--r-sm)',
                  border: 'none',
                  background: submitting ? 'var(--line)' : 'var(--ink)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: submitting ? 'default' : 'pointer',
                  color: submitting ? 'var(--muted2)' : 'white',
                }}
              >
                {submitting ? 'Posting…' : 'Post Project'}
              </button>
            )}
          </div>
        </div>

        {/* Right: sticky product summary card */}
        {product && <ProductSummaryCard product={product} />}
      </div>
    </div>
  )
}

// ---- Step components ----

function StepDetails({ form, setForm, productName }: { form: any; setForm: any; productName: string }) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>Product Details</h2>
      <p style={{ fontSize: 13.5, color: 'var(--muted2)', marginBottom: 24 }}>Confirm the details for this sourcing project.</p>

      <Field label="Project Name">
        <input
          type="text"
          value={form.projectName}
          onChange={e => setForm((f: any) => ({ ...f, projectName: e.target.value }))}
          placeholder={productName}
          style={inputStyle}
        />
      </Field>
      <Field label="Target Quantity">
        <input
          type="text"
          value={form.quantity}
          onChange={e => setForm((f: any) => ({ ...f, quantity: e.target.value }))}
          placeholder="e.g. 10,000 units/month"
          style={inputStyle}
        />
      </Field>
      <Field label="Target Price (SRP)">
        <input
          type="text"
          value={form.targetPrice}
          onChange={e => setForm((f: any) => ({ ...f, targetPrice: e.target.value }))}
          placeholder="e.g. $4.99"
          style={inputStyle}
        />
      </Field>
      <Field label="Timeline">
        <input
          type="text"
          value={form.timeline}
          onChange={e => setForm((f: any) => ({ ...f, timeline: e.target.value }))}
          placeholder="e.g. Q3 2026 launch"
          style={inputStyle}
        />
      </Field>
    </div>
  )
}

function StepRequirements({ form, setForm }: { form: any; setForm: any }) {
  const certs = ['USDA Organic', 'Non-GMO', 'Kosher', 'Gluten-Free', 'SQF', 'BRC', 'FSSC 22000']
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>Requirements</h2>
      <p style={{ fontSize: 13.5, color: 'var(--muted2)', marginBottom: 24 }}>Specify certifications and any additional notes for suppliers.</p>

      <Field label="Required Certifications">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {certs.map(cert => {
            const selected = form.certifications.includes(cert)
            return (
              <button
                key={cert}
                onClick={() => setForm((f: any) => ({
                  ...f,
                  certifications: selected
                    ? f.certifications.filter((c: string) => c !== cert)
                    : [...f.certifications, cert],
                }))}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--pill)',
                  border: `1px solid ${selected ? 'var(--ink)' : 'var(--line)'}`,
                  background: selected ? 'var(--ink)' : 'white',
                  color: selected ? 'white' : 'var(--ink)',
                  fontSize: 12.5,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {cert}
              </button>
            )
          })}
        </div>
      </Field>

      <Field label="Additional Notes">
        <textarea
          value={form.notes}
          onChange={e => setForm((f: any) => ({ ...f, notes: e.target.value }))}
          placeholder="Any specific manufacturing or quality requirements…"
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </Field>
    </div>
  )
}

function StepInvite({ form, setForm }: { form: any; setForm: any }) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>Invite Suppliers</h2>
      <p style={{ fontSize: 13.5, color: 'var(--muted2)', marginBottom: 24 }}>Choose which suppliers to invite to this sourcing project.</p>

      <div
        style={{
          border: '1px solid var(--line)',
          borderRadius: 'var(--r)',
          padding: 20,
          marginBottom: 16,
        }}
      >
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
          <input
            type="radio"
            checked={form.inviteAll}
            onChange={() => setForm((f: any) => ({ ...f, inviteAll: true }))}
            style={{ marginTop: 3 }}
          />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>
              Let Keychain AI find the best suppliers ✨
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted2)' }}>
              Keychain AI will identify and shortlist the most qualified manufacturers based on your requirements.
            </div>
          </div>
        </label>
      </div>

      <div
        style={{
          border: '1px solid var(--line)',
          borderRadius: 'var(--r)',
          padding: 20,
        }}
      >
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
          <input
            type="radio"
            checked={!form.inviteAll}
            onChange={() => setForm((f: any) => ({ ...f, inviteAll: false }))}
            style={{ marginTop: 3 }}
          />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>
              Manually select suppliers from My Supply Chain
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted2)' }}>
              Choose specific suppliers you already have relationships with.
            </div>
          </div>
        </label>
      </div>
    </div>
  )
}

function StepReview({ form, product }: { form: any; product: Product | null }) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>Review & Post</h2>
      <p style={{ fontSize: 13.5, color: 'var(--muted2)', marginBottom: 24 }}>Review your project details before posting.</p>

      <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        {[
          ['Project Name', form.projectName || product?.name || '—'],
          ['Target Quantity', form.quantity || '—'],
          ['Target Price', form.targetPrice || '—'],
          ['Timeline', form.timeline || '—'],
          ['Certifications', form.certifications.length > 0 ? form.certifications.join(', ') : '—'],
          ['Supplier Discovery', form.inviteAll ? 'Keychain AI (recommended)' : 'Manual selection'],
        ].map(([label, value], i, arr) => (
          <div
            key={label}
            style={{
              display: 'flex',
              padding: '12px 16px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none',
            }}
          >
            <div style={{ width: 180, fontSize: 13, fontWeight: 500, color: 'var(--muted)' }}>{label}</div>
            <div style={{ fontSize: 13, color: 'var(--ink)' }}>{value}</div>
          </div>
        ))}
      </div>

      {form.notes && (
        <div style={{ marginTop: 16, padding: 16, background: 'var(--bg-soft)', borderRadius: 'var(--r)', fontSize: 13, color: 'var(--muted)' }}>
          <strong>Notes:</strong> {form.notes}
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 'var(--r)',
  border: '1px solid var(--line)',
  fontSize: 13.5,
  color: 'var(--ink)',
  outline: 'none',
  background: 'white',
}

function ProductSummaryCard({ product }: { product: Product }) {
  return (
    <div
      style={{
        width: 300,
        flexShrink: 0,
        borderLeft: '1px solid var(--line)',
        padding: 24,
        overflowY: 'auto',
        position: 'sticky',
        top: 0,
        height: '100%',
        background: 'var(--bg-soft)',
      }}
    >
      {/* Product image */}
      <div
        style={{
          width: '100%',
          aspectRatio: '1',
          borderRadius: 'var(--r-lg)',
          background: 'white',
          border: '1px solid var(--line)',
          overflow: 'hidden',
          marginBottom: 16,
        }}
      >
        <img
          src={product.thumbnail}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f3f4f6" width="100" height="100"/></svg>' }}
        />
      </div>

      {/* Brand + category */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          {product.brand}
        </span>
        <StatusPill label={product.category} />
      </div>

      {/* Product name */}
      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 8, lineHeight: 1.3 }}>
        {product.name}
      </h3>

      {/* AI chip */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '3px 10px',
          borderRadius: 'var(--pill)',
          background: '#F3F4F6',
          border: '1px solid var(--line)',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--muted)',
          marginBottom: 14,
        }}
      >
        <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        </svg>
        Pre-filled · please review
      </div>

      <div style={{ fontSize: 12.5, color: 'var(--muted2)', lineHeight: 1.6, marginBottom: 16 }}>
        Private-label sourcing project for {product.name}. Keychain AI has pre-filled the details based on your product catalog.
      </div>

      {/* Manufacturing processes */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>Manufacturing Processes</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {['Weigher', 'Depositor', '+8'].map(p => (
            <span key={p} style={{ padding: '3px 9px', borderRadius: 'var(--pill)', background: '#F3F4F6', border: '1px solid var(--line)', fontSize: 11.5, fontWeight: 500, color: 'var(--muted)' }}>{p}</span>
          ))}
        </div>
      </div>

      {/* Packaging */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>Packaging Material</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {['Box', 'Bag'].map(p => (
            <span key={p} style={{ padding: '3px 9px', borderRadius: 'var(--pill)', background: '#F3F4F6', border: '1px solid var(--line)', fontSize: 11.5, fontWeight: 500, color: 'var(--muted)' }}>{p}</span>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14, fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
        SRP: $17.27
      </div>
    </div>
  )
}
