import type { Meta, StoryObj } from '@storybook/react-vite'
import { PreviewCard } from './preview-card'
import { Badge } from '../../components/feedback/badge'
import { Button } from '../../components/inputs/button'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Cards/PreviewCard',
  component: PreviewCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof PreviewCard>

export default meta

type Story = StoryObj<typeof meta>

function svgThumb(label: string, a: string, b: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 300">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${a}" />
          <stop offset="100%" stop-color="${b}" />
        </linearGradient>
      </defs>
      <rect width="480" height="300" fill="url(#g)" />
      <text x="40" y="270" font-family="sans-serif" font-size="32" fill="white" opacity="0.92">${label}</text>
    </svg>
  `)}`
}

export const Review: Story = {
  args: { title: 'Preview', imageSrc: '' },
  render: () => (
    <StorybookPage
      title="PreviewCard"
      description="Image preview card with title, description, and optional meta + actions. Use for browsing-style content (templates, datasets, examples)."
    >
      <StorybookSection title="Variants">
        <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
          <StorybookCard title="Title only">
            <PreviewCard
              title="Workspace template"
              imageSrc={svgThumb('Template', '#214d96', '#35c6a7')}
            />
          </StorybookCard>
          <StorybookCard title="With description">
            <PreviewCard
              title="Defect detection"
              description="Pre-configured for common surface defect types."
              imageSrc={svgThumb('Defect', '#7747a9', '#2962d9')}
            />
          </StorybookCard>
          <StorybookCard title="With meta + actions">
            <PreviewCard
              title="Calibration set"
              description="Reference patterns for camera calibration."
              imageSrc={svgThumb('Calib', '#8a5f18', '#d98929')}
              meta={<Badge $tone="success">Ready</Badge>}
              actions={<Button size="sm" variant="secondary">Use template</Button>}
            />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
