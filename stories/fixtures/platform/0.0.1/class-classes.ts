import sample1 from '../../../assets/20230808.jpg'

export interface MockClass {
  id: string
  name: string
  color: string
  description?: string | null
  image_count: number
  reference_image_url?: string | null
}

export const mockClasses: MockClass[] = [
  { id: 'cl-1', name: 'Crack', color: '#ef4444', description: 'Surface micro-crack defect, typically straight or branching.', image_count: 312, reference_image_url: sample1 as string },
  { id: 'cl-2', name: 'Scratch', color: '#f59e0b', description: 'Linear scratch on the surface, length > 1mm.', image_count: 187 },
  { id: 'cl-3', name: 'Stain', color: '#3b82f6', description: null, image_count: 94 },
  { id: 'cl-4', name: 'Contamination', color: '#10b981', description: 'Foreign particle on wafer.', image_count: 41 },
  { id: 'cl-5', name: 'Discoloration', color: '#a855f7', description: 'Color deviation from expected baseline.', image_count: 23 },
  { id: 'cl-6', name: 'Burn mark', color: '#ec4899', description: 'Heat / electrical damage.', image_count: 12 },
  { id: 'cl-7', name: 'Dent', color: '#06b6d4', description: 'Physical indentation.', image_count: 7 },
  { id: 'cl-8', name: 'Edge defect', color: '#84cc16', description: 'Defect near the edge boundary.', image_count: 5 },
  { id: 'cl-9', name: 'Bubble', color: '#f97316', description: null, image_count: 3 },
  { id: 'cl-10', name: 'Foreign object', color: '#22d3ee', description: 'Non-classified foreign body.', image_count: 1 },
]

export function makeManyClasses(): MockClass[] {
  return Array.from({ length: 24 }, (_, i) => ({
    ...mockClasses[i % mockClasses.length],
    id: `cl-many-${i + 1}`,
    name: `${mockClasses[i % mockClasses.length].name} #${i + 1}`,
    image_count: 200 - i * 7,
  }))
}

export const longClassName = 'A-very-long-class-name-for-testing-overflow-behavior-in-list-views-and-details'

export function classIdToColorMap(classes: MockClass[]): Record<string, string> {
  return Object.fromEntries(classes.map((c) => [c.id, c.color]))
}
