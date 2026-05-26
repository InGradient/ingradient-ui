import { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { GalleryImageMenu } from './gallery-image-menu'
import { Button } from '../../components/inputs/button'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/GalleryImageMenu',
  component: GalleryImageMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof GalleryImageMenu>

export default meta

type Story = StoryObj<typeof meta>

const DATASETS = [
  { id: 'd1', name: 'Wafer line A' },
  { id: 'd2', name: 'Surface defects' },
  { id: 'd3', name: 'Pixel segmentation' },
]

function MenuTrigger({
  label = 'Open menu',
  ...menuProps
}: { label?: string } & Omit<Parameters<typeof GalleryImageMenu>[0], 'anchorEl' | 'onClose'>) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  return (
    <>
      <Button ref={triggerRef} onClick={() => setAnchor(triggerRef.current)} variant="secondary">
        {label}
      </Button>
      <GalleryImageMenu {...menuProps} anchorEl={anchor} onClose={() => setAnchor(null)} />
    </>
  )
}

export const Review: Story = {
  args: { anchorEl: null, onClose: () => undefined },
  render: () => (
    <StorybookPage
      title="GalleryImageMenu"
      description="이미지 셀의 컨텍스트 메뉴. ContextMenuWithSubmenus 를 기반으로 Open in labeling / Copy to / Move to / Cut / Paste / Archive / Delete 같은 표준 액션을 조립한다."
    >
      <StorybookSection title="Action presets" description="props 조합에 따른 메뉴 구성 차이.">
        <StorybookGrid columns="repeat(auto-fit, minmax(220px, 1fr))">
          <StorybookCard title="Full menu" subtitle="모든 액션 활성화">
            <MenuTrigger
              label="Full"
              datasets={DATASETS}
              clipboardHasImages
              onOpenLabeling={() => undefined}
              onCopyTo={() => undefined}
              onMoveTo={() => undefined}
              onCut={() => undefined}
              onPaste={() => undefined}
              onArchive={() => undefined}
              onDelete={() => undefined}
            />
          </StorybookCard>
          <StorybookCard title="Archived" subtitle="archived=true → Unarchive 표시">
            <MenuTrigger
              label="Archived"
              archived
              onUnarchive={() => undefined}
              onDelete={() => undefined}
            />
          </StorybookCard>
          <StorybookCard title="No clipboard" subtitle="clipboardHasImages=false → Paste 비활성">
            <MenuTrigger
              label="No clipboard"
              onCut={() => undefined}
              onPaste={() => undefined}
              onDelete={() => undefined}
            />
          </StorybookCard>
          <StorybookCard title="Minimal" subtitle="Delete만">
            <MenuTrigger label="Minimal" onDelete={() => undefined} />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
