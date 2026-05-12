export interface MockClass {
  id: string
  name: string
  color: string
  imageCount: number
  description?: string
}

const baseClasses: MockClass[] = [
  { id: 'c-001', name: 'Crack', color: '#ef4444', imageCount: 312, description: 'Surface micro-crack defect' },
  { id: 'c-002', name: 'Scratch', color: '#f59e0b', imageCount: 187, description: 'Linear scratch on surface' },
  { id: 'c-003', name: 'Stain', color: '#3b82f6', imageCount: 94 },
  { id: 'c-004', name: 'Contamination', color: '#10b981', imageCount: 41, description: 'Foreign particle on wafer' },
]

const longName = 'A-very-long-class-name-for-testing-overflow-behavior-in-list-views-and-details'

export type ClassScenario =
  | 'default'
  | 'empty'
  | 'loading'
  | 'error'
  | 'permission-denied'
  | 'long-text'
  | 'many-items'

export interface ClassScene {
  classes: MockClass[]
  selectedId: string | null
  loading: boolean
  error?: string
  permissionDenied?: boolean
}

export const classScenarios: Record<ClassScenario, ClassScene> = {
  default: { classes: baseClasses, selectedId: 'c-001', loading: false },
  empty: { classes: [], selectedId: null, loading: false },
  loading: { classes: [], selectedId: null, loading: true },
  error: { classes: [], selectedId: null, loading: false, error: 'Failed to load classes.' },
  'permission-denied': { classes: [], selectedId: null, loading: false, permissionDenied: true },
  'long-text': {
    classes: baseClasses.map((c, i) => i === 0 ? { ...c, name: longName, description: longName } : c),
    selectedId: 'c-001', loading: false,
  },
  'many-items': {
    classes: Array.from({ length: 18 }, (_, i) => ({
      ...baseClasses[i % baseClasses.length],
      id: `c-many-${i}`,
      name: `${baseClasses[i % baseClasses.length].name} #${i + 1}`,
    })),
    selectedId: 'c-many-0', loading: false,
  },
}
