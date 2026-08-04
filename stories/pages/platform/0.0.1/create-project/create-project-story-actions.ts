import type { ProjectType } from '@ingradient/platform-pages'

export interface CreateProjectStoryActions {
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onFirstDatasetNameChange: (value: string) => void
  onProjectTypeChange: (value: ProjectType) => void
  onFilesAdd: (fileNames: string[]) => void
  onSubmit: () => void
  onCancel: () => void
}
