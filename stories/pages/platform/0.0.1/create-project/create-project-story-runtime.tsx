import { useEffect, useState } from 'react'
import { CreateProjectView, type ProjectType } from '@ingradient/platform-pages'
import { fn } from 'storybook/test'
import {
  createProjectScenarios,
  type CreateProjectScenario,
} from '../../../../fixtures/platform/0.0.1/create-project-scenarios'
import { defineHandoff } from '../../../../support/handoff'
import type { CreateProjectStoryActions } from './create-project-story-actions'

export interface CreateProjectStoryArgs extends CreateProjectStoryActions {
  scenario: CreateProjectScenario
}

export const CREATE_PROJECT_SCENARIO_LABELS: Record<CreateProjectScenario, string> = {
  default: 'Empty project form',
  filled: 'Prepared project form',
  'validation-error': 'Project name validation error',
  submitting: 'Project creation in progress',
  'server-error': 'Project creation server error',
}

const createProjectHandoff = defineHandoff({
  service: 'platform',
  version: '0.0.1',
  page: 'Create Project',
  referenceStory: 'Pages / Platform / 0.0.1 / Create Project / Workspace / Overview',
  preset: 'platform-0.0.1',
  fixturesPath: 'stories/fixtures/platform/0.0.1/create-project-scenarios.ts',
  requiredScenarios: ['default', 'filled', 'validation-error', 'submitting', 'server-error'],
  interactions: [
    'validation 상태 → form 수정 → project type / initial image 선택 → submit Action',
    'Cancel → navigation Action',
    '각 field 변경 → controlled value + 명시적 Action payload',
  ],
  platformIntegration: [
    'CreateProjectView 를 그대로 import — story runtime 이 controlled props 를 구성',
    'onSubmit → createProject() + uploadFiles() (frontend/api/{projects,images}.ts)',
    'project type → general / deflectometry / photometric_stereo capability',
    '성공 후 setCurrentProjectId() + navigate("/", { replace: true })',
  ],
})

const ACTION_ARG_TYPE = {
  control: { disable: true },
  table: { category: 'Actions', disable: true },
} as const

export function createCreateProjectActionArgs(): CreateProjectStoryActions {
  return {
    onNameChange: fn<(value: string) => void>(),
    onDescriptionChange: fn<(value: string) => void>(),
    onFirstDatasetNameChange: fn<(value: string) => void>(),
    onProjectTypeChange: fn<(value: ProjectType) => void>(),
    onFilesAdd: fn<(fileNames: string[]) => void>(),
    onSubmit: fn<() => void>(),
    onCancel: fn<() => void>(),
  }
}

export function createProjectArgTypes(options: readonly CreateProjectScenario[]) {
  return {
    scenario: {
      control: {
        type: 'select' as const,
        labels: Object.fromEntries(options.map((key) => [key, CREATE_PROJECT_SCENARIO_LABELS[key]])),
      },
      options: [...options],
      description: 'Choose a documented Create Project state in this group.',
      table: { category: 'Create Project state' },
    },
    onNameChange: ACTION_ARG_TYPE,
    onDescriptionChange: ACTION_ARG_TYPE,
    onFirstDatasetNameChange: ACTION_ARG_TYPE,
    onProjectTypeChange: ACTION_ARG_TYPE,
    onFilesAdd: ACTION_ARG_TYPE,
    onSubmit: ACTION_ARG_TYPE,
    onCancel: ACTION_ARG_TYPE,
  }
}

export function createProjectParameters(description: string) {
  return {
    layout: 'fullscreen' as const,
    ...createProjectHandoff,
    a11y: { test: 'error' as const },
    controls: { expanded: true },
    docs: {
      ...createProjectHandoff.docs,
      description: {
        component: `${description}\n\n${createProjectHandoff.docs.description.component}`,
      },
    },
  }
}

function placeholderFiles(count: number): File[] {
  return Array.from(
    { length: count },
    (_, index) => new File(['placeholder'], `image-${index + 1}.jpg`, { type: 'image/jpeg' }),
  )
}

export function CreateProjectScene({ scenario: key, ...actions }: CreateProjectStoryArgs) {
  const scenario = createProjectScenarios[key]
  const [name, setName] = useState(scenario.name)
  const [description, setDescription] = useState(scenario.description)
  const [firstDatasetName, setFirstDatasetName] = useState(scenario.firstDatasetName)
  const [projectType, setProjectType] = useState<ProjectType>(scenario.projectType)
  const [files, setFiles] = useState<File[]>(() => placeholderFiles(scenario.filesCount))
  const [validationError, setValidationError] = useState<string | null>(
    scenario.validationError ?? null,
  )

  useEffect(() => {
    setName(scenario.name)
    setDescription(scenario.description)
    setFirstDatasetName(scenario.firstDatasetName)
    setProjectType(scenario.projectType)
    setFiles(placeholderFiles(scenario.filesCount))
    setValidationError(scenario.validationError ?? null)
  }, [scenario])

  return (
    <CreateProjectView
      name={name}
      description={description}
      firstDatasetName={firstDatasetName}
      projectType={projectType}
      files={files}
      submitting={scenario.submitting}
      error={scenario.error ?? null}
      validationError={validationError}
      onNameChange={(value) => {
        actions.onNameChange(value)
        setName(value)
        if (value.trim()) setValidationError(null)
      }}
      onDescriptionChange={(value) => {
        actions.onDescriptionChange(value)
        setDescription(value)
      }}
      onFirstDatasetNameChange={(value) => {
        actions.onFirstDatasetNameChange(value)
        setFirstDatasetName(value)
      }}
      onProjectTypeChange={(value) => {
        actions.onProjectTypeChange(value)
        setProjectType(value)
      }}
      onFilesAdd={(next) => {
        actions.onFilesAdd(next.map((file) => file.name))
        setFiles((current) => [...current, ...next])
      }}
      onSubmit={actions.onSubmit}
      onCancel={actions.onCancel}
    />
  )
}
