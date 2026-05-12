import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, Button, Card, RadioCardGroup, TextField, TextareaField, UploadDropzone } from '@ingradient/ui/components'
import { FieldGroup, FieldLabel, FormSection } from '@ingradient/ui/patterns'
import { Stack, Inline } from '@ingradient/ui/primitives'
import { BrandLogo } from '@ingradient/ui/brand'
import { createProjectScenarios, type CreateProjectScenario } from '../../../fixtures/platform/0.0.1/create-project-scenarios'
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
    'project type RadioCardGroup 선택 (general / deflectometry)',
    'UploadDropzone 에 이미지 drop 또는 file picker',
    'Create Project 클릭 → submit (이름 비어있으면 validation error)',
    'Cancel 클릭 → 이전 페이지로',
  ],
  platformIntegration: [
    'replace handleSubmit with createProject() API call (frontend/api/projects.ts)',
    'files 업로드는 uploadFiles() (frontend/api/images.ts) — first dataset 의 dataset id 필요',
    'deflectometry → createProject({ deflectometry_enabled: true })',
    '성공 후 setCurrentProjectId() + navigate("/", { replace: true })',
  ],
})

type Args = { scenario: CreateProjectScenario }

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  padding: 'var(--ig-space-8)',
  background: 'var(--ig-color-bg-canvas)',
}

const contentStyle: React.CSSProperties = { width: 'min(720px, calc(100vw - 32px))' }
const logoWrapStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center' }
const cardStyle: React.CSSProperties = { padding: 'var(--ig-space-8)', borderRadius: 'var(--ig-radius-xl)' }
const titleStyle: React.CSSProperties = {
  margin: '0 0 var(--ig-space-6)', fontSize: 'var(--ig-font-size-2xl)', fontWeight: 600, textAlign: 'center',
}
const optionalStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)', marginLeft: 'var(--ig-space-2)',
}
const fileItemStyle: React.CSSProperties = {
  fontSize: 'var(--ig-font-size-sm)', color: 'var(--ig-color-text-muted)', fontFamily: 'var(--ig-font-mono)',
}

const projectTypeOptions = [
  { value: 'general', label: 'General Project' },
  { value: 'deflectometry', label: 'Deflectometry Project' },
]

function CreateProjectScene({ scenario }: Args) {
  const scene = createProjectScenarios[scenario]
  return (
    <div style={pageStyle}>
      <Stack gap={6} style={contentStyle}>
        <div style={logoWrapStyle}><BrandLogo width={220} /></div>
        <Card style={cardStyle}>
          <h1 style={titleStyle}>Add Project</h1>
          <Stack gap={6}>
            {scene.error ? <Alert $tone="danger">{scene.error}</Alert> : null}
            {scene.validationError ? <Alert $tone="warning">{scene.validationError}</Alert> : null}

            <FormSection>
              <FieldGroup>
                <FieldLabel htmlFor="project-name">Project name</FieldLabel>
                <TextField
                  id="project-name"
                  type="text"
                  value={scene.name}
                  placeholder="Enter project name"
                  readOnly
                  disabled={scene.submitting}
                />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel htmlFor="project-description">
                  Description <span style={optionalStyle}>(optional)</span>
                </FieldLabel>
                <TextareaField
                  id="project-description"
                  value={scene.description}
                  placeholder="Project description"
                  readOnly
                  disabled={scene.submitting}
                  rows={3}
                />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel htmlFor="first-dataset-name">
                  First dataset name <span style={optionalStyle}>(optional)</span>
                </FieldLabel>
                <TextField
                  id="first-dataset-name"
                  type="text"
                  value={scene.firstDatasetName}
                  placeholder="Enter dataset name"
                  readOnly
                  disabled={scene.submitting}
                />
              </FieldGroup>
            </FormSection>

            <FormSection>
              <FieldGroup>
                <FieldLabel>Project type</FieldLabel>
                <RadioCardGroup
                  options={projectTypeOptions}
                  value={scene.projectType}
                  onChange={() => undefined}
                />
              </FieldGroup>
            </FormSection>

            <FormSection>
              <FieldGroup>
                <FieldLabel>Initial images <span style={optionalStyle}>(optional)</span></FieldLabel>
                <UploadDropzone accept="image/*" multiple onFiles={() => undefined} disabled={scene.submitting}>
                  <span>Drop images here or click to browse</span>
                </UploadDropzone>
                {scene.filesCount > 0 ? (
                  <span style={fileItemStyle}>{scene.filesCount} image(s) ready to upload</span>
                ) : null}
              </FieldGroup>
            </FormSection>

            <Inline gap={3} justify="flex-start">
              <Button type="submit" variant="accent" disabled={scene.submitting}>
                {scene.submitting ? 'Creating…' : 'Create Project'}
              </Button>
              <Button type="button" variant="secondary" disabled={scene.submitting}>
                Cancel
              </Button>
            </Inline>
          </Stack>
        </Card>
      </Stack>
    </div>
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
