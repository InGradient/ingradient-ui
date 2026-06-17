export interface ClassEntry {
  id: string
  name: string
  color: string
  description?: string | null
  image_count: number
  reference_image_url?: string | null
}

export interface ClassImageBbox {
  classId?: string
  x: number
  y: number
  w: number
  h: number
}

export interface ClassImagePoint {
  classId?: string
  x: number
  y: number
}

export interface ClassImage {
  id: string
  name: string
  thumb_url: string
  original_url?: string
  width: number
  height: number
  bboxes?: ClassImageBbox[]
  points?: ClassImagePoint[]
  sequence_id?: string | null
  pattern_label?: string | null
  dataset_id?: string
}

export interface ClassDataset {
  id: string
  name: string
  image_count: number
}

export interface ReferenceBboxCandidate {
  imageId: string
  bboxIndex: number
}

export interface ClassListPaneProps {
  classes: ClassEntry[]
  selectedClassId: string | null
  loading?: boolean
  sidebarCollapsed?: boolean
  openMenuId?: string
  onSelectClass: (id: string | null) => void
  onAddClass: () => void
  onCollapse?: () => void
  onExpand?: () => void
  onOpenClassMenu?: (id: string, anchor: HTMLElement) => void
}

export interface ClassImagesPaneProps {
  selectedClassId: string | null
  datasets: ClassDataset[]
  activeDatasetIds: Set<string>
  detailLoading?: boolean
  imagesLoading?: boolean
  images: ClassImage[]
  classIdToColor: Record<string, string>
  onToggleDataset: (id: string) => void
  onOpenImage: (image: ClassImage) => void
  onOpenContextMenu: (image: ClassImage, position: { top: number; left: number }) => void
}

export interface ClassInfoPaneProps {
  selectedClass: ClassEntry
  isReferenceDragOver: boolean
  referencePending?: boolean
  referenceError?: string | null
  referenceBboxCandidates?: ReferenceBboxCandidate[]
  showCocoMapping?: boolean
  cocoMappingOptions: readonly string[]
  currentMapping: string
  onChangeClass: (patch: Partial<ClassEntry>) => void
  onRandomizeColor: () => void
  onSetReferenceDragOver: (v: boolean) => void
  onApplyReferenceImage: (imageId: string, bboxIndex?: number) => void
  onChangeMapping: (value: string) => void
}

export interface ClassManageOverlaysProps {
  addClass: {
    open: boolean
    name: string
    onNameChange: (name: string) => void
    onClose: () => void
    onConfirm: () => void
  }
  classMenu?: {
    anchorEl: HTMLElement | null
    onClose: () => void
    onDuplicate: () => void
    onDelete: () => void
  }
  contextMenu: {
    position: { top: number; left: number } | null
    onClose: () => void
    onAction?: (actionKey: string) => void
  }
  lightbox: {
    image: ClassImage | null
    selectedClassId: string | null
    classIdToColor: Record<string, string>
    onClose: () => void
  }
  deleteConfirm: {
    open: boolean
    selectedClass: ClassEntry | null
    onConfirm: () => void
    onCancel: () => void
  }
}

export interface ClassManageViewProps {
  projectName?: string | null
  permissionDenied?: boolean
  error?: string | null
  noProject?: boolean
  list: ClassListPaneProps
  images: ClassImagesPaneProps
  info: ClassInfoPaneProps | null
  overlays: ClassManageOverlaysProps
}
