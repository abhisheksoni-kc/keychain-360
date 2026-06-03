/**
 * Repository — the ONLY layer that knows the data store.
 * Swap seed.json for Postgres/KV here without touching any page or component.
 *
 * In v1: in-memory store initialized from seed.json on first access.
 * Writes persist within a server instance (resets on cold start / redeploy).
 */

import seedData from '@/data/seed.json'

export type Product = {
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
  createdAt: string
}

export type Project = {
  id: string
  productId: string
  name: string
  status: string
  type: string
  thumbnail: string
  date: string
  teamMembers: number
  supplierIds: string[]
}

export type Supplier = {
  id: string
  projectId: string
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

// ---- in-memory store ----
let _products: Product[] = JSON.parse(JSON.stringify(seedData.products))
let _projects: Project[] = JSON.parse(JSON.stringify(seedData.projects))
let _suppliers: Supplier[] = JSON.parse(JSON.stringify(seedData.suppliers))

// ---- Products ----
export function getProducts(opts?: {
  search?: string
  stage?: string
  brand?: string
  category?: string
  page?: number
  pageSize?: number
}): { data: Product[]; total: number } {
  let data = [..._products]
  if (opts?.search) {
    const q = opts.search.toLowerCase()
    data = data.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  }
  if (opts?.stage) data = data.filter(p => p.stage === opts.stage)
  if (opts?.brand) data = data.filter(p => p.brand === opts.brand)
  if (opts?.category) data = data.filter(p => p.category === opts.category)
  const total = data.length
  const page = opts?.page ?? 1
  const pageSize = opts?.pageSize ?? 10
  data = data.slice((page - 1) * pageSize, page * pageSize)
  return { data, total }
}

export function getProduct(id: string): Product | undefined {
  return _products.find(p => p.id === id)
}

export function createProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
  const newProduct: Product = {
    ...product,
    id: `p${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  _products.unshift(newProduct)
  return newProduct
}

export function updateProduct(id: string, patch: Partial<Product>): Product | undefined {
  const idx = _products.findIndex(p => p.id === id)
  if (idx === -1) return undefined
  _products[idx] = { ..._products[idx], ...patch }
  return _products[idx]
}

export function getProductFilters() {
  const stages = Array.from(
    new Set(_products.map(p => p.stage).filter((s): s is string => s !== null))
  )
  const brands = Array.from(new Set(_products.map(p => p.brand)))
  const categories = Array.from(new Set(_products.map(p => p.category)))
  return { stages, brands, categories }
}

// ---- Projects ----
export function getProjects(): Project[] {
  return [..._projects]
}

export function getProject(id: string): Project | undefined {
  return _projects.find(p => p.id === id)
}

export function createProject(project: Omit<Project, 'id'>): Project {
  const newProject: Project = { ...project, id: `proj${Date.now()}` }
  _projects.unshift(newProject)
  return newProject
}

// ---- Suppliers ----
export function getSuppliersByProject(projectId: string): Supplier[] {
  return _suppliers.filter(s => s.projectId === projectId)
}

export function getSupplier(id: string): Supplier | undefined {
  return _suppliers.find(s => s.id === id)
}

export function createSupplier(supplier: Omit<Supplier, 'id'>): Supplier {
  const newSupplier: Supplier = { ...supplier, id: `s${Date.now()}` }
  _suppliers.push(newSupplier)
  return newSupplier
}

export function updateSupplier(id: string, patch: Partial<Supplier>): Supplier | undefined {
  const idx = _suppliers.findIndex(s => s.id === id)
  if (idx === -1) return undefined
  _suppliers[idx] = { ..._suppliers[idx], ...patch }
  return _suppliers[idx]
}

// ---- Reset (dev only) ----
export function resetStore() {
  _products = JSON.parse(JSON.stringify(seedData.products))
  _projects = JSON.parse(JSON.stringify(seedData.projects))
  _suppliers = JSON.parse(JSON.stringify(seedData.suppliers))
}
