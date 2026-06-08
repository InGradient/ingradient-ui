import { mockClasses, makeManyClasses, longClassName, type MockClass } from './class-classes'
import { classIdToDatasets, type MockClassDataset } from './class-datasets'
import {
  imagesForCl1, sequenceImagesForCl1, manyImagesForCl1,
  referenceBboxCandidatesForCl1, type MockClassImage,
} from './class-images'

export type ClassScenarioKey =
  | 'default'
  | 'sidebar-collapsed'
  | 'no-class-selected'
  | 'class-with-images'
  | 'class-with-grouped-images'
  | 'empty'
  | 'loading'
  | 'error'
  | 'permission-denied'
  | 'no-project'
  | 'long-text'
  | 'many-items'
  | 'no-linked-datasets'
  | 'images-loading'
  | 'images-empty'
  | 'drag-over-reference'
  | 'reference-image-set'
  | 'reference-image-pending'
  | 'bbox-nav-multi'
  | 'lightbox-open'
  | 'lightbox-with-pattern-tabs'
  | 'context-menu-open'
  | 'class-menu-open'
  | 'add-class-modal-open'
  | 'delete-confirm-open'
  | 'mapping-coco-active'
  | 'mapping-disabled'

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
  classMenuOpenId?: string
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

export const classScenarios: Record<ClassScenarioKey, ClassScene> = {
  'default': base,
  'sidebar-collapsed': { ...base, sidebarCollapsed: true },
  'no-class-selected': { ...base, selectedClassId: null, datasets: [], images: [] },
  'class-with-images': base,
  'class-with-grouped-images': { ...base, images: manyImagesForCl1 },
  'empty': { ...base, classes: [], selectedClassId: null, datasets: [], images: [] },
  'loading': { ...base, classes: [], classesLoading: true, selectedClassId: null, datasets: [], images: [] },
  'error': { ...base, classes: [], error: 'Failed to load classes. Try again.', selectedClassId: null, datasets: [], images: [] },
  'permission-denied': { ...base, classes: [], permissionDenied: true, selectedClassId: null, datasets: [], images: [] },
  'no-project': { ...base, classes: [], noProject: true, selectedClassId: null, datasets: [], images: [] },
  'long-text': { ...base, classes: longClasses, selectedClassId: 'cl-1' },
  'many-items': {
    ...base,
    classes: makeManyClasses(),
    selectedClassId: 'cl-many-3',
    datasets: classIdToDatasets['cl-1'],
    images: imagesForCl1.slice(0, 4),
  },
  'no-linked-datasets': { ...base, selectedClassId: 'cl-7', datasets: [], images: [] },
  'images-loading': { ...base, imagesLoading: true, images: [] },
  'images-empty': { ...base, images: [] },
  'drag-over-reference': { ...base, isReferenceDragOver: true },
  'reference-image-set': base,
  'reference-image-pending': { ...base, referencePending: true },
  'bbox-nav-multi': { ...base, referenceBboxCandidates: referenceBboxCandidatesForCl1 },
  'lightbox-open': { ...base, lightboxImage: imagesForCl1[0] },
  'lightbox-with-pattern-tabs': { ...base, images: sequenceImagesForCl1, lightboxImage: sequenceImagesForCl1[1], lightboxSiblings: sequenceImagesForCl1 },
  'context-menu-open': { ...base, contextMenuOpen: { imageId: 'img-cl1-1', top: 240, left: 460 } },
  'class-menu-open': { ...base, classMenuOpenId: 'cl-1' },
  'add-class-modal-open': { ...base, isAddClassOpen: true, addClassName: 'New defect' },
  'delete-confirm-open': { ...base, deleteConfirmOpen: true },
  'mapping-coco-active': { ...base, showCocoMapping: true, currentMapping: 'person' },
  'mapping-disabled': { ...base, showCocoMapping: false },
}

export { mockClasses } from './class-classes'
export type { MockClass } from './class-classes'
export type { MockClassDataset } from './class-datasets'
export type { MockClassImage } from './class-images'
