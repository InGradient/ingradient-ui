import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageGridCell } from './image-grid-cell'
import { Badge } from '../../components/feedback/badge'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Gallery/ImageGridCell',
  component: ImageGridCell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ImageGridCell>

export default meta

type Story = StoryObj<typeof meta>

const sample = { id: 'img-1', name: 'wafer-line-a-batch-04.jpg' }
const thumbnailUrl =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#a855f7"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/><circle cx="100" cy="100" r="44" fill="rgba(255,255,255,0.18)"/></svg>`,
  )

function InteractiveCell({ initialSelected = false }: { initialSelected?: boolean }) {
  const [selected, setSelected] = useState(initialSelected)
  return (
    <div style={{ width: 220 }}>
      <ImageGridCell
        item={sample}
        index={0}
        selected={selected}
        thumbnailUrl={thumbnailUrl}
        onItemClick={() => setSelected((v) => !v)}
      />
    </div>
  )
}

export const Review: Story = {
  args: { item: sample, index: 0, selected: false, thumbnailUrl },
  render: () => (
    <StorybookPage
      title="ImageGridCell"
      description="이미지 그리드의 단일 셀. selected ring, hover lift, 그리고 overlay / topRight / footer slot을 통한 콘텐츠 합성을 지원한다."
    >
      <StorybookSection title="Selection state" description="선택 여부에 따른 ring · border 차이.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="Unselected" subtitle="기본">
            <InteractiveCell />
          </StorybookCard>
          <StorybookCard title="Selected" subtitle="ring + border 강조">
            <InteractiveCell initialSelected />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Slots" description="overlay / topRight / footer slot 활용.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="With footer" subtitle="renderCellFooter">
            <div style={{ width: 220 }}>
              <ImageGridCell
                item={sample}
                index={0}
                selected={false}
                thumbnailUrl={thumbnailUrl}
                renderCellFooter={() => (
                  <span style={{ fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)' }}>
                    wafer-line-a-batch-04.jpg
                  </span>
                )}
              />
            </div>
          </StorybookCard>
          <StorybookCard title="With top-right badge" subtitle="renderCellTopRight">
            <div style={{ width: 220 }}>
              <ImageGridCell
                item={sample}
                index={0}
                selected={false}
                thumbnailUrl={thumbnailUrl}
                renderCellTopRight={() => <Badge $tone="accent">New</Badge>}
              />
            </div>
          </StorybookCard>
          <StorybookCard title="All slots" subtitle="overlay + topRight + footer">
            <div style={{ width: 220 }}>
              <ImageGridCell
                item={sample}
                index={0}
                selected
                thumbnailUrl={thumbnailUrl}
                renderCellOverlay={() => (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent 50%)',
                    }}
                  />
                )}
                renderCellTopRight={() => <Badge $tone="success">Labeled</Badge>}
                renderCellFooter={() => (
                  <span style={{ fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)' }}>
                    256 × 256 · 184 KB
                  </span>
                )}
              />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
