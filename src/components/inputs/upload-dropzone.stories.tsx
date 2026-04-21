import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { UploadDropzone } from './upload-dropzone'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/UploadDropzone',
  component: UploadDropzone,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'todo',
    },
  },
  args: {
    onFiles: () => undefined,
  },
} satisfies Meta<typeof UploadDropzone>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  render: () => {
    const [files, setFiles] = React.useState<string[]>([])

    return (
      <StorybookPage
        title="UploadDropzone"
        description="UploadDropzone is the reusable drag-and-select surface for files. Review empty, selected, and disabled states without coupling it to one uploader workflow."
      >
        <StorybookSection
          title="Dropzone review"
          description="Use the native file picker from the drop area to verify callback shape and status rendering."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(300px, 1fr))">
            <StorybookCard title="Interactive uploader" subtitle="callback state">
              <StorybookStack gap={12}>
                <UploadDropzone
                  accept=".png,.jpg,.jpeg"
                  onFiles={(nextFiles) => setFiles(nextFiles.map((file) => file.name))}
                >
                  <strong style={{ color: 'var(--ig-color-text-primary)' }}>Drop inspection images here</strong>
                  <span>or click to browse local files</span>
                </UploadDropzone>
                <div
                  style={{
                    border: '1px solid var(--ig-color-border-subtle)',
                    borderRadius: 16,
                    padding: 14,
                    background: 'var(--ig-color-surface-panel)',
                    fontSize: 13,
                    color: 'var(--ig-color-text-secondary)',
                  }}
                >
                  {files.length > 0 ? `Selected: ${files.join(', ')}` : 'No files selected yet.'}
                </div>
              </StorybookStack>
            </StorybookCard>
            <StorybookCard title="Disabled state" subtitle="read-only context">
              <UploadDropzone disabled onFiles={() => undefined}>
                <strong style={{ color: 'var(--ig-color-text-primary)' }}>Upload locked while sync is running</strong>
                <span>Keep disabled mode explicit when upload is temporarily unavailable.</span>
              </UploadDropzone>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
