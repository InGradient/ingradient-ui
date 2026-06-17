import type { AnnotationBoundingBox } from '@ingradient/ui/patterns'
import type { Comment } from '@ingradient/platform-pages'

export const sampleAnnotations: AnnotationBoundingBox[] = [
  { id: 'box-1', label: 'Crack', color: '#ff6b6b', x: 0.12, y: 0.18, width: 0.32, height: 0.24 },
  { id: 'box-2', label: 'Scratch', color: '#feca57', x: 0.55, y: 0.42, width: 0.28, height: 0.18 },
  { id: 'box-3', label: 'Dent', color: '#48dbfb', x: 0.32, y: 0.62, width: 0.18, height: 0.20 },
]

export const sampleClassTags = [
  { id: 'cl-1', name: 'Crack', color: '#ff6b6b' },
  { id: 'cl-2', name: 'Scratch', color: '#feca57' },
]

export const sampleMultiClassTags = [
  { id: 'cl-1', name: 'Crack', color: '#ff6b6b', count: 2 },
  { id: 'cl-2', name: 'Scratch', color: '#feca57', count: 1 },
  { id: 'cl-3', name: 'Dent', color: '#48dbfb', count: 1 },
  { id: 'cl-4', name: 'Stain', color: '#a55eea' },
  { id: 'cl-5', name: 'Rust', color: '#1dd1a1' },
]

export const sampleComments: Comment[] = [
  { id: 'cm-1', authorName: 'June Lee', authorInitials: 'JL', body: 'Suspected crack on top-left edge.', createdAt: '2 hours ago' },
  { id: 'cm-2', authorName: 'Soyeon Park', authorInitials: 'SP', body: 'Confirmed. Reassigned class to "Crack".', createdAt: '1 hour ago' },
  { id: 'cm-3', authorName: 'Daniel Kim', authorInitials: 'DK', body: 'Closing — ready for labeling review.', createdAt: '30 min ago' },
]
