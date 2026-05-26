import type { RefObject, FormEvent } from 'react'

// ── AddDatasetModal ───────────────────────────────────────────────────────────

export type EdgeTaskType = 'classification' | 'object_detection' | 'segmentation' | 'point'

export interface AddDatasetClass {
  class_id: string
  class_name: string
  color: string
}

export interface AddDatasetModalLabels {
  title: string
  cancel: string
  add: string
  adding: string
  datasetNameLabel: string
  taskTypeLabel: string
  classesLabel: (selected: number, total: number) => string
  taskTypeOptions: Record<EdgeTaskType, string>
}

export interface AddDatasetModalViewProps {
  name: string
  taskType: EdgeTaskType
  selectedClassIds: Set<string>
  allClasses: AddDatasetClass[]
  namePlaceholder: string

  adding: boolean
  error: string | null

  labels: AddDatasetModalLabels

  onNameChange: (value: string) => void
  onTaskTypeChange: (value: EdgeTaskType) => void
  onClassesChange: (ids: Set<string>) => void
  onSubmit: (e: FormEvent) => void
  onClose: () => void

  nameInputRef?: RefObject<HTMLInputElement>
}

// ── ExportModal ───────────────────────────────────────────────────────────────

export type ExportPhase = 'idle' | 'running' | 'done' | 'error'

export interface ExportModalLabels {
  title: string
  cancel: string
  close: string
  export: string
  exporting: string
  complete: string
  images: (count: number) => string
  localImages: (count: number) => string
}

export interface ExportModalViewProps {
  datasetName: string
  imageCount: number
  localImageCount: number
  phase: ExportPhase
  error: string | null
  labels: ExportModalLabels
  onClose: () => void
  onExport: () => void
}

// ── CreateProjectForm ─────────────────────────────────────────────────────────

export interface CreateProjectFormLabels {
  emptyOnline: string
  createOnPlatform: string
}

export interface CreateProjectFormViewProps {
  labels: CreateProjectFormLabels
}
