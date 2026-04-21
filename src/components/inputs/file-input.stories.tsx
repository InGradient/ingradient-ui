import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { FileInput } from './file-input'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/FileInput',
  component: FileInput,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      test: 'todo',
    },
  },
} satisfies Meta<typeof FileInput>

export default meta

type Story = StoryObj<typeof meta>

function FileInputDemo() {
  const [files, setFiles] = React.useState<string[]>([])

  return (
    <StorybookStack gap={14}>
      <FileInput
        label="Choose assets"
        accept="image/*"
        onFiles={(nextFiles) => setFiles(nextFiles.map((file) => `${file.name} (${file.type || 'unknown'})`))}
      />
      <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
        Use FileInput when the system file picker is enough and drag-and-drop is unnecessary.
      </div>
      <div
        style={{
          border: '1px solid var(--ig-color-border-subtle)',
          borderRadius: 16,
          padding: 14,
          background: 'var(--ig-color-surface-panel)',
          minHeight: 72,
        }}
      >
        {files.length > 0 ? files.join(', ') : 'No files selected yet.'}
      </div>
    </StorybookStack>
  )
}

export const Review: Story = {
  args: {
    onFiles: () => {},
    label: 'Choose assets',
  },
  render: () => (
    <StorybookPage
      title="FileInput"
      description="FileInput is the minimal system-picker control. Prefer it for simple attachment or import flows where a full dropzone would be excessive."
    >
      <StorybookSection
        title="Picker-only upload"
        description="Compare the plain system picker contract before introducing UploadDropzone or workflow-specific wrappers."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
          <StorybookCard title="Basic import" subtitle="single button + picker">
            <FileInputDemo />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const input = canvasElement.querySelector('input[type="file"]')
    if (!(input instanceof HTMLInputElement)) throw new Error('Expected hidden file input to exist')
    const file = new File(['png-bytes'], 'sample.png', { type: 'image/png' })
    await userEvent.upload(input, file)
    await expect(canvas.getByText(/sample.png/i)).toBeInTheDocument()
  },
}
