export type ProjectType = 'general' | 'deflectometry'

export interface CreateProjectViewProps {
  name: string
  description: string
  firstDatasetName: string
  projectType: ProjectType
  files: File[]

  submitting?: boolean
  error?: string | null
  validationError?: string | null

  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onFirstDatasetNameChange: (value: string) => void
  onProjectTypeChange: (value: ProjectType) => void
  onFilesAdd: (newFiles: File[]) => void
  onSubmit: () => void
  onCancel: () => void
}
