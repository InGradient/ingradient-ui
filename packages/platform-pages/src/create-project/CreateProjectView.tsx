import { chartHeights } from '@ingradient/ui'
import { type FormEvent } from 'react'
import { BrandLogo } from '@ingradient/ui/brand'
import { Alert, Button } from '@ingradient/ui/components'
import { Inline } from '@ingradient/ui/primitives'
import {
  Card,
  Content,
  Form,
  LogoWrap,
  Page,
  Title,
} from './CreateProjectView.styles'
import { DetailsSection, ImagesSection, TypeSection } from './sections'
import type { CreateProjectViewProps } from './types'

export function CreateProjectView({
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
          <BrandLogo width={chartHeights.smPlus} />
        </LogoWrap>
        <Card>
          <Title>Add Project</Title>
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

            <Inline gap={3} justify="flex-start">
              <Button type="submit" variant="accent" disabled={submitting}>
                {submitting ? 'Creating…' : 'Create Project'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={submitting}
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Inline>
          </Form>
        </Card>
      </Content>
    </Page>
  )
}
