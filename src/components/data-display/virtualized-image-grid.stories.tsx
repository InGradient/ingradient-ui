import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { VirtualizedImageGrid } from './virtualized-image-grid'
import { Badge } from '../feedback/badge'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/VirtualizedImageGrid',
  component: VirtualizedImageGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'todo' },
  },
} satisfies Meta<typeof VirtualizedImageGrid>

export default meta

type Story = StoryObj<typeof meta>

type Item = { id: string; label: string; src: string; tag?: string }

function svgThumb(label: string, a: string, b: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${a}" />
          <stop offset="100%" stop-color="${b}" />
        </linearGradient>
      </defs>
      <rect width="320" height="320" fill="url(#g)" />
      <text x="20" y="280" font-family="sans-serif" font-size="22" fill="white">${label}</text>
    </svg>
  `)}`
}

const palettes: Array<[string, string]> = [
  ['#214d96', '#35c6a7'],
  ['#7747a9', '#2962d9'],
  ['#8a5f18', '#d98929'],
  ['#1f6f5c', '#79c4a8'],
  ['#9c2a45', '#d96380'],
  ['#3d4a6b', '#6b8aa8'],
]

function makeItems(n: number): Item[] {
  return Array.from({ length: n }, (_, i) => {
    const [a, b] = palettes[i % palettes.length]
    return {
      id: `frame-${i}`,
      label: `Frame ${i + 1}`,
      src: svgThumb(`#${i + 1}`, a, b),
      tag: i % 5 === 0 ? 'Synced' : undefined,
    }
  })
}

const smallItems = makeItems(20)
const largeItems = makeItems(200)

export const Review: Story = {
  args: { items: [], getThumbnailUrl: () => '' },
  render: () => {
    const [selectedIds, setSelectedIds] = React.useState(new Set<string>(['frame-1', 'frame-3']))

    const handleSelectionChange = (action: 'toggle' | 'range' | 'single', id: string) => {
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
        title="VirtualizedImageGrid"
        description="TanStack row-based virtualized image grid for large datasets (1k+ items). Fixed columns + estimated row height. Use ImageGrid for smaller lists; this component shines when virtualization actually pays off."
      >
        <StorybookSection title="Basic" description="Selection + render slots. Caller provides ResizeObserver if dynamic columns needed.">
          <StorybookGrid columns="1fr">
            <StorybookCard title="20 items, 4 columns" subtitle="footer slot + tag in top-right">
              <div style={{ height: 480 }}>
                <VirtualizedImageGrid<Item>
                  items={smallItems}
                  getThumbnailUrl={(item) => item.src}
                  columns={4}
                  estimatedItemHeight={240}
                  selectedIds={selectedIds}
                  onSelectionChange={handleSelectionChange}
                  renderCellTopRight={(item) =>
                    item.tag ? <Badge $tone="success">{item.tag}</Badge> : null
                  }
                  renderCellFooter={(item) => <span>{item.label}</span>}
                />
              </div>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>

        <StorybookSection title="Large dataset" description="200 items — virtualization at work. Scroll to see additional rows mount.">
          <StorybookGrid columns="1fr">
            <StorybookCard title="200 items, 5 columns, 600px viewport" subtitle="overscan=5 (more rows pre-mounted)">
              <div style={{ height: 600 }}>
                <VirtualizedImageGrid<Item>
                  items={largeItems}
                  getThumbnailUrl={(item) => item.src}
                  columns={5}
                  estimatedItemHeight={220}
                  overscan={5}
                  renderCellFooter={(item) => <span>{item.label}</span>}
                />
              </div>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>

        <StorybookSection title="Edge cases">
          <StorybookGrid columns="repeat(auto-fit, minmax(320px, 1fr))">
            <StorybookCard title="Empty" subtitle="no items">
              <div style={{ height: 240 }}>
                <VirtualizedImageGrid<Item>
                  items={[]}
                  getThumbnailUrl={() => ''}
                />
              </div>
            </StorybookCard>
            <StorybookCard title="Single column" subtitle="columns=1 (vertical list)">
              <div style={{ height: 360 }}>
                <VirtualizedImageGrid<Item>
                  items={smallItems.slice(0, 5)}
                  getThumbnailUrl={(item) => item.src}
                  columns={1}
                  estimatedItemHeight={300}
                  renderCellFooter={(item) => <span>{item.label}</span>}
                />
              </div>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
