import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { CreateProjectView, type ProjectType } from '@ingradient/platform-pages'
import {
  createProjectScenarios,
  type CreateProjectScenario,
} from '../../../fixtures/platform/0.0.1/create-project-scenarios'
import { scenarioArgType } from '../../../support/scenarios'
import { defineHandoff } from '../../../support/handoff'

const handoff = defineHandoff({
  service: 'platform',
  version: '0.0.1',
  page: 'CreateProject',
  referenceStory: 'Pages / Platform / 0.0.1 / CreateProject / Default',
  preset: 'platform-0.0.1',
  fixturesPath: 'stories/fixtures/platform/0.0.1/create-project-scenarios.ts',
  requiredScenarios: ['default', 'filled', 'validation-error', 'submitting', 'server-error'],
  interactions: [
    'name / description / first dataset name 입력',
    'project type OptionCard 선택 (general / deflectometry)',
    'Dropzone 에 이미지 drop 또는 file picker',
    'Create Project 클릭 → submit (이름 비어있으면 validation error)',
    'Cancel 클릭 → 이전 페이지로',
  ],
  platformIntegration: [
    'CreateProjectView 를 그대로 import — props 에 hook 결과 연결',
    'onSubmit → createProject() + uploadFiles() (frontend/api/{projects,images}.ts)',
    'deflectometry → createProject({ deflectometry_enabled: true })',
    '성공 후 setCurrentProjectId() + navigate("/", { replace: true })',
  ],
})

type Args = { scenario: CreateProjectScenario }

function placeholderFiles(count: number): File[] {
  return Array.from(
    { length: count },
    (_, i) => new File(['placeholder'], `image-${i + 1}.jpg`, { type: 'image/jpeg' }),
  )
}

function CreateProjectScene({ scenario }: Args) {
  const scene = createProjectScenarios[scenario]
  const [name, setName] = useState(scene.name)
  const [description, setDescription] = useState(scene.description)
  const [firstDatasetName, setFirstDatasetName] = useState(scene.firstDatasetName)
  const [projectType, setProjectType] = useState<ProjectType>(scene.projectType)
  const [files, setFiles] = useState<File[]>(placeholderFiles(scene.filesCount))

  return (
    <CreateProjectView
      name={name}
      description={description}
      firstDatasetName={firstDatasetName}
      projectType={projectType}
      files={files}
      submitting={scene.submitting}
      error={scene.error ?? null}
      validationError={scene.validationError ?? null}
      onNameChange={setName}
      onDescriptionChange={setDescription}
      onFirstDatasetNameChange={setFirstDatasetName}
      onProjectTypeChange={setProjectType}
      onFilesAdd={(next) => setFiles((prev) => [...prev, ...next])}
      onSubmit={() => undefined}
      onCancel={() => undefined}
    />
  )
}

const meta = {
  title: 'Pages/Platform/0.0.1/CreateProject',
  component: CreateProjectScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff },
  argTypes: {
    scenario: scenarioArgType(['filled', 'validation-error', 'submitting', 'server-error']),
  },
  args: { scenario: 'default' },
} satisfies Meta<typeof CreateProjectScene>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Filled: Story = { args: { scenario: 'filled' } }
export const ValidationError: Story = { args: { scenario: 'validation-error' } }
export const Submitting: Story = { args: { scenario: 'submitting' } }
export const ServerError: Story = { args: { scenario: 'server-error' } }
