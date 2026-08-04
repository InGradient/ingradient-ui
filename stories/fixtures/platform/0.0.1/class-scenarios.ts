import { mockClasses, makeManyClasses, longClassName, type MockClass } from './class-classes'
import { classIdToDatasets, type MockClassDataset } from './class-datasets'
import {
  imagesForCl1, sequenceImagesForCl1, manyImagesForCl1,
  referenceBboxCandidatesForCl1, type MockClassImage,
} from './class-images'

export type ClassScenarioKey =
  | 'default'
  | 'sidebar-collapsed'
  | 'large-image-set'
  | 'class-list-overflow'
  | 'no-class-selected'
  | 'no-classes'
  | 'classes-loading'
  | 'error'
  | 'permission-denied'
  | 'no-project'
  | 'no-linked-datasets'
  | 'linked-datasets-loading'
  | 'images-loading'
  | 'no-images'
  | 'drag-over-reference'
  | 'reference-image-pending'
  | 'reference-image-error'
  | 'bbox-nav-multi'
  | 'pattern-sequence'
  | 'add-class-dialog'
  | 'mapping-enabled'

export interface ClassScene {
  classes: MockClass[]
  selectedClassId: string | null
  sidebarCollapsed?: boolean
  datasets: MockClassDataset[]
  activeDatasetIds: Set<string>
  images: MockClassImage[]
  classesLoading?: boolean
  detailLoading?: boolean
  imagesLoading?: boolean
  error?: string
  permissionDenied?: boolean
  noProject?: boolean
  isReferenceDragOver?: boolean
  referencePending?: boolean
  referenceError?: string
  referenceBboxCandidates?: Array<{ imageId: string; bboxIndex: number }>
  isAddClassOpen?: boolean
  addClassName?: string
  contextMenuOpen?: { imageId: string; top: number; left: number } | null
  lightboxImage?: MockClassImage | null
  lightboxSiblings?: MockClassImage[]
  deleteConfirmOpen?: boolean
  showCocoMapping?: boolean
  currentMapping?: string
}

const base: ClassScene = {
  classes: mockClasses,
  selectedClassId: 'cl-1',
  datasets: classIdToDatasets['cl-1'],
  activeDatasetIds: new Set(),
  images: imagesForCl1,
  showCocoMapping: false,
}

const longClasses: MockClass[] = mockClasses.map((c, i) =>
  i === 0 ? { ...c, name: longClassName, description: `${longClassName} - ${longClassName}` } : c)

const overflowClasses = [...longClasses, ...makeManyClasses()]

export const classScenarios: Record<ClassScenarioKey, ClassScene> = {
  'default': base,
  'sidebar-collapsed': { ...base, sidebarCollapsed: true },
  'large-image-set': { ...base, images: manyImagesForCl1 },
  'class-list-overflow': { ...base, classes: overflowClasses },
  'no-class-selected': { ...base, selectedClassId: null, datasets: [], images: [] },
  'no-classes': { ...base, classes: [], selectedClassId: null, datasets: [], images: [] },
  'classes-loading': { ...base, classes: [], classesLoading: true, selectedClassId: null, datasets: [], images: [] },
  'error': { ...base, classes: [], error: 'Failed to load classes. Try again.', selectedClassId: null, datasets: [], images: [] },
  'permission-denied': { ...base, classes: [], permissionDenied: true, selectedClassId: null, datasets: [], images: [] },
  'no-project': { ...base, classes: [], noProject: true, selectedClassId: null, datasets: [], images: [] },
  'no-linked-datasets': { ...base, selectedClassId: 'cl-7', datasets: [], images: [] },
  'linked-datasets-loading': { ...base, detailLoading: true },
  'images-loading': { ...base, imagesLoading: true, images: [] },
  'no-images': { ...base, images: [] },
  'drag-over-reference': { ...base, isReferenceDragOver: true },
  'reference-image-pending': { ...base, referencePending: true },
  'reference-image-error': { ...base, referenceError: 'Failed to update reference image. Try again.' },
  'bbox-nav-multi': { ...base, referenceBboxCandidates: referenceBboxCandidatesForCl1 },
  'pattern-sequence': { ...base, images: sequenceImagesForCl1, lightboxImage: sequenceImagesForCl1[1], lightboxSiblings: sequenceImagesForCl1 },
  'add-class-dialog': { ...base, isAddClassOpen: true, addClassName: '' },
  'mapping-enabled': { ...base, showCocoMapping: true, currentMapping: '' },
}

export { mockClasses } from './class-classes'
export type { MockClass } from './class-classes'
export type { MockClassDataset } from './class-datasets'
export type { MockClassImage } from './class-images'
