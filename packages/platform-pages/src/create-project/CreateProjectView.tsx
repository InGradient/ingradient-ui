import { type FormEvent } from 'react'
import { BrandLogo } from '@ingradient/ui/brand'
import { Alert, Button } from '@ingradient/ui/components'
import {
  Actions,
  Card,
  Content,
  Form,
  LogoWrap,
  Page,
  Subtitle,
  Title,
} from './CreateProjectView.styles'
import { DetailsSection, ImagesSection, TypeSection } from './sections'
import type { CreateProjectViewProps } from './types'
import { SurfaceDepthProvider } from '@ingradient/ui/primitives'

function CreateProjectViewContent({
  name,
  description,
  firstDatasetName,
  projectType,
  files,
  submitting = false,
  error,
  validationError,
  onNameChange,
  onDescriptionChange,
  onFirstDatasetNameChange,
  onProjectTypeChange,
  onFilesAdd,
  onSubmit,
  onCancel,
}: CreateProjectViewProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <Page>
      <Content>
        <LogoWrap>
          <BrandLogo width={220} />
        </LogoWrap>
        <Card>
          <Title>Create Project</Title>
          <Subtitle>Configure the project workspace, labeling workflow, and initial images.</Subtitle>
          <Form onSubmit={handleSubmit}>
            {error ? <Alert $tone="danger">{error}</Alert> : null}
            {validationError ? <Alert $tone="warning">{validationError}</Alert> : null}

            <DetailsSection
              name={name}
              description={description}
              firstDatasetName={firstDatasetName}
              disabled={submitting}
              onNameChange={onNameChange}
              onDescriptionChange={onDescriptionChange}
              onFirstDatasetNameChange={onFirstDatasetNameChange}
            />

            <TypeSection
              projectType={projectType}
              disabled={submitting}
              onChange={onProjectTypeChange}
            />

            <ImagesSection files={files} disabled={submitting} onFilesAdd={onFilesAdd} />

            <Actions>
              <Button
                type="button"
                variant="secondary"
                disabled={submitting}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button type="submit" variant="solid" disabled={submitting}>
                {submitting ? 'Creating…' : 'Create Project'}
              </Button>
            </Actions>
          </Form>
        </Card>
      </Content>
    </Page>
  )
}

/**
 * Platform pages turn on surface depth so a rounded surface inside another rounded surface is
 * always less rounded than its parent (DESIGN.draft.md §5).
 */
export function CreateProjectView(props: CreateProjectViewProps) {
  return (
    <SurfaceDepthProvider>
      <CreateProjectViewContent {...props} />
    </SurfaceDepthProvider>
  )
}
