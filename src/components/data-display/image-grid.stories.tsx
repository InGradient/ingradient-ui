import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../feedback/badge'
import { ImageGrid } from './image-grid'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/ImageGrid',
  component: ImageGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'todo',
    },
  },
} satisfies Meta<typeof ImageGrid>

export default meta

type Story = StoryObj<typeof meta>

type ImageItem = {
  id: string
  title: string
  description: string
  tag: string
  src: string
}

function svgThumb(title: string, a: string, b: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${a}" />
          <stop offset="100%" stop-color="${b}" />
        </linearGradient>
      </defs>
      <rect width="480" height="480" fill="url(#g)" />
      <circle cx="110" cy="112" r="62" fill="rgba(255,255,255,0.15)" />
      <circle cx="380" cy="356" r="92" fill="rgba(255,255,255,0.10)" />
      <text x="40" y="410" font-family="IBM Plex Sans, sans-serif" font-size="34" fill="white" opacity="0.92">${title}</text>
    </svg>
  `)}`
}

const items: ImageItem[] = [
  {
    id: 'frame-a',
    title: 'Workspace thumbnail',
    description: 'Operational asset preview with neutral metadata.',
    tag: 'ready',
    src: svgThumb('Workspace', '#214d96', '#35c6a7'),
  },
  {
    id: 'frame-b',
    title: 'Audit gallery',
    description: 'Grid card with selection and compact badge metadata.',
    tag: 'review',
    src: svgThumb('Audit', '#7747a9', '#2962d9'),
  },
  {
    id: 'frame-c',
    title: 'Template browser',
    description: 'Visual browsing card with short descriptive copy.',
    tag: 'draft',
    src: svgThumb('Template', '#8a5f18', '#d98929'),
  },
]

export const Review: Story = {
  args: {
    items,
    getImageSrc: (item) => items.find((candidate) => candidate.id === item.id)?.src ?? items[0].src,
  },
  render: () => {
    const [selectedIds, setSelectedIds] = React.useState<Array<string | number>>(['frame-b'])

    return (
      <StorybookPage
        title="Image Grid"
        description="ImageGrid is the reusable visual browsing shell for gallery-like content. Review selection, metadata, and density here before adding domain-specific workflow logic."
      >
        <StorybookSection
          title="Gallery review"
          description="Compare default and denser thumbnail layouts using the same card contract."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(320px, 1fr))">
            <StorybookCard title="Default density" subtitle="gallery-like browsing">
              <ImageGrid
                items={items}
                selectedIds={selectedIds}
                onItemClick={(item) => setSelectedIds([item.id])}
                getImageSrc={(item) => item.src}
                getTitle={(item) => item.title}
                getDescription={(item) => item.description}
                getMeta={(item) => <Badge>{item.tag}</Badge>}
              />
            </StorybookCard>
            <StorybookCard title="Compact density" subtitle="denser asset list">
              <ImageGrid
                items={items}
                minItemWidth={140}
                selectedIds={selectedIds}
                onItemClick={(item) => setSelectedIds([item.id])}
                getImageSrc={(item) => item.src}
                getTitle={(item) => item.title}
                getDescription={(item) => item.description}
                getMeta={(item) => <Badge>{item.tag}</Badge>}
              />
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
