import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { TextField, TextareaField } from '@ingradient/ui/components'
import { FieldGroup, FieldHint, FieldLabel } from '@ingradient/ui/patterns'
import {
  Dropzone,
  FieldsBody,
  FileInput,
  FileItem,
  FileList,
  OptionCard,
  OptionGrid,
  OptionText,
  OptionTitle,
  OptionalLabel,
  Section,
  SectionBody,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from './CreateProjectView.styles'
import type { ProjectType } from './types'

const TYPE_OPTIONS: Array<{ value: ProjectType; title: string; description: string }> = [
  {
    value: 'general',
    title: 'General Project',
    description: 'Standard image labeling and review workflow.',
  },
  {
    value: 'deflectometry',
    title: 'Deflectometry Project',
    description: 'Enables Edge Setup mode and deflectometry sequence workflow.',
  },
  {
    value: 'photometric_stereo',
    title: 'Photometric Stereo Project',
    description: 'Enables Edge Setup mode and photometric stereo light-sequence workflow.',
  },
]

const onlyImages = (list: FileList | null) =>
  Array.from(list ?? []).filter((f) => f.type.startsWith('image/'))

export function DetailsSection(props: {
  name: string
  description: string
  firstDatasetName: string
  disabled: boolean
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onFirstDatasetNameChange: (value: string) => void
}) {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Project details</SectionTitle>
        <SectionDescription>Name the project and prepare its first dataset.</SectionDescription>
      </SectionHeader>
      <FieldsBody>
        <FieldGroup>
          <FieldLabel htmlFor="project-name">Project name</FieldLabel>
          <TextField
            id="project-name"
            type="text"
            value={props.name}
            onChange={(e) => props.onNameChange(e.target.value)}
            placeholder="Enter project name"
            required
            disabled={props.disabled}
          />
        </FieldGroup>
        <FieldGroup>
          <FieldLabel htmlFor="project-description">
            Description <OptionalLabel>(optional)</OptionalLabel>
          </FieldLabel>
          <TextareaField
            id="project-description"
            value={props.description}
            onChange={(e) => props.onDescriptionChange(e.target.value)}
            placeholder="Project description"
            disabled={props.disabled}
            rows={3}
          />
        </FieldGroup>
        <FieldGroup>
          <FieldLabel htmlFor="first-dataset-name">
            First dataset name <OptionalLabel>(optional)</OptionalLabel>
          </FieldLabel>
          <TextField
            id="first-dataset-name"
            type="text"
            value={props.firstDatasetName}
            onChange={(e) => props.onFirstDatasetNameChange(e.target.value)}
            placeholder="Enter dataset name"
            disabled={props.disabled}
          />
        </FieldGroup>
      </FieldsBody>
    </Section>
  )
}

export function TypeSection(props: {
  projectType: ProjectType
  disabled: boolean
  onChange: (value: ProjectType) => void
}) {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Project type</SectionTitle>
        <SectionDescription>Choose the workflow that matches how images will be captured and labeled.</SectionDescription>
      </SectionHeader>
      <SectionBody>
        <OptionGrid>
          {TYPE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              type="button"
              $active={props.projectType === opt.value}
              aria-pressed={props.projectType === opt.value}
              onClick={() => props.onChange(opt.value)}
              disabled={props.disabled}
            >
              <OptionTitle>{opt.title}</OptionTitle>
              <OptionText>{opt.description}</OptionText>
            </OptionCard>
          ))}
        </OptionGrid>
      </SectionBody>
    </Section>
  )
}

export function ImagesSection(props: {
  files: File[]
  disabled: boolean
  onFilesAdd: (newFiles: File[]) => void
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const next = onlyImages(e.dataTransfer.files)
    if (next.length > 0) props.onFilesAdd(next)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const next = onlyImages(e.target.files)
    if (next.length > 0) props.onFilesAdd(next)
    e.target.value = ''
  }

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>
          Initial images <OptionalLabel>(optional)</OptionalLabel>
        </SectionTitle>
        <SectionDescription>Add images now, or start with an empty project and upload them later.</SectionDescription>
      </SectionHeader>
      <SectionBody>
        <Dropzone
          type="button"
          $active={dragOver}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          disabled={props.disabled}
        >
          Drag images here or click to select
        </Dropzone>
        <FileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
        />
        {props.files.length > 0 ? (
          <FileList>
            {props.files.map((file, index) => (
              <FileItem key={`${file.name}-${index}`}>
                {file.name} ({Math.round(file.size / 1024)} KB)
              </FileItem>
            ))}
          </FileList>
        ) : null}
        <FieldHint>
          Only image files are accepted. Uploaded files are added to the first dataset after
          project creation.
        </FieldHint>
      </SectionBody>
    </Section>
  )
}
