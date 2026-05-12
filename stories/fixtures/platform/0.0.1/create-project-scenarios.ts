export type CreateProjectScenario =
  | 'default'
  | 'filled'
  | 'validation-error'
  | 'submitting'
  | 'server-error'

export interface CreateProjectScene {
  name: string
  description: string
  firstDatasetName: string
  projectType: 'general' | 'deflectometry'
  filesCount: number
  error?: string
  submitting?: boolean
  validationError?: string
}

export const createProjectScenarios: Record<CreateProjectScenario, CreateProjectScene> = {
  default: { name: '', description: '', firstDatasetName: '', projectType: 'general', filesCount: 0 },
  filled: {
    name: 'Wafer line A Q2 2026',
    description: 'Quality inspection dataset for line A wafer production batch.',
    firstDatasetName: 'Initial captures',
    projectType: 'general',
    filesCount: 12,
  },
  'validation-error': {
    name: '',
    description: 'Project description provided but name is missing.',
    firstDatasetName: '',
    projectType: 'general',
    filesCount: 0,
    validationError: 'Project name is required.',
  },
  submitting: {
    name: 'Wafer line A Q2 2026',
    description: 'Quality inspection dataset for line A wafer production batch.',
    firstDatasetName: 'Initial captures',
    projectType: 'general',
    filesCount: 12,
    submitting: true,
  },
  'server-error': {
    name: 'Wafer line A Q2 2026',
    description: '',
    firstDatasetName: '',
    projectType: 'deflectometry',
    filesCount: 0,
    error: 'Failed to create project. Network error.',
  },
}
