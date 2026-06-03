import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../../components/feedback/badge'
import { ImageGrid } from './image-grid'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Gallery/ImageGrid',
  component: ImageGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'error',
    },
  },
} satisfies Meta<typeof ImageGrid>

export default meta

type Story = StoryObj<typeof meta>

type ImageItem = {
  id: string
  title: string
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
  { id: 'frame-a', title: 'Workspace', tag: 'ready', src: svgThumb('Workspace', '#214d96', '#35c6a7') },
  { id: 'frame-b', title: 'Audit', tag: 'review', src: svgThumb('Audit', '#7747a9', '#2962d9') },
  { id: 'frame-c', title: 'Template', tag: 'draft', src: svgThumb('Template', '#8a5f18', '#d98929') },
  { id: 'frame-d', title: 'Inspect', tag: 'ready', src: svgThumb('Inspect', '#1f6f5c', '#79c4a8') },
]

export const Review: Story = {
  args: { items: [], getThumbnailUrl: () => '' },
  render: () => {
    const [selectedIds, setSelectedIds] = React.useState(new Set<string>(['frame-b']))

    const handleSelectionChange = (action: 'toggle' | 'range' | 'single', id: string, _index: number) => {
      setSelectedIds((prev) => {
        if (action === 'single') return new Set([id])
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    }

    return (
      <StorybookPage
        title="Image Grid"
        description="ImageGrid is the reusable visual browsing shell for gallery-like content. Domain-specific UI (annotation, hover preview, sync state) is injected via render slots."
      >
        <StorybookSection title="Default" description="Basic grid with footer slot only.">
          <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-lg), 1fr))">
            <StorybookCard title="Footer slot" subtitle="title rendered via renderCellFooter">
              <ImageGrid<ImageItem>
                items={items}
                getThumbnailUrl={(item) => item.src}
                renderCellFooter={(item) => <span>{item.title}</span>}
              />
            </StorybookCard>
            <StorybookCard title="Top-right slot" subtitle="badge in renderCellTopRight">
              <ImageGrid<ImageItem>
                items={items}
                getThumbnailUrl={(item) => item.src}
                layout={{ minWidth: 140, gap: 4 }}
                renderCellTopRight={(item) => <Badge>{item.tag}</Badge>}
                renderCellFooter={(item) => <span>{item.title}</span>}
              />
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>

        <StorybookSection title="Selection" description="Multi-select via shift/ctrl. Caller manages selectedIds Set.">
          <StorybookGrid columns="1fr">
            <StorybookCard title="Click to toggle, ctrl+click for multi">
              <ImageGrid<ImageItem>
                items={items}
                getThumbnailUrl={(item) => item.src}
                layout={{ minWidth: 160, gap: 4 }}
                selectedIds={selectedIds}
                onSelectionChange={handleSelectionChange}
                renderCellFooter={(item) => <span>{item.title}</span>}
              />
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
