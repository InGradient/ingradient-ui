export type MockCatalogClass = {
  id: string
  name: string
  color: string
  count?: number
}

export const mockClasses: MockCatalogClass[] = [
  { id: 'cl-1', name: 'Crack', color: '#ff6b6b', count: 412 },
  { id: 'cl-2', name: 'Scratch', color: '#feca57', count: 318 },
  { id: 'cl-3', name: 'Dent', color: '#48dbfb', count: 247 },
  { id: 'cl-4', name: 'Discoloration', color: '#1dd1a1', count: 165 },
  { id: 'cl-5', name: 'Stain', color: '#a55eea', count: 105 },
  { id: 'cl-6', name: 'Rust', color: '#ee5a6f', count: 89 },
  { id: 'cl-7', name: 'Bubble', color: '#54a0ff', count: 62 },
  { id: 'cl-8', name: 'Contamination', color: '#ff9f43', count: 48 },
  { id: 'cl-9', name: 'Misalignment', color: '#5f27cd' },
  { id: 'cl-10', name: 'Edge defect', color: '#10ac84' },
]
