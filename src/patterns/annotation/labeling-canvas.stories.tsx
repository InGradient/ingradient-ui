import type { Meta, StoryObj } from '@storybook/react-vite'
import { LabelingCanvas } from './labeling-canvas'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Annotation/LabelingCanvas',
  component: LabelingCanvas,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof LabelingCanvas>

export default meta

type Story = StoryObj<typeof meta>

// 작은 단색 + 라벨 샘플 이미지 (4:3). controlled imageAspect 와 일치.
const SAMPLE_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240">' +
      '<rect width="320" height="240" fill="#2b3445"/>' +
      '<text x="160" y="125" fill="#9aa7bd" font-family="sans-serif" font-size="18" text-anchor="middle">sample image</text>' +
      '</svg>',
  )

const noopMouseHandlers = {
  onMouseDown: () => {},
  onMouseMove: () => {},
  onMouseUp: () => {},
  onMouseLeave: () => {},
}

const HOST = { width: 'var(--ig-popup-md)', height: 'var(--ig-popup-sm)' }

export const Review: Story = {
  args: {
    imageUrl: SAMPLE_IMAGE,
    alt: 'Sample labeling image',
    imageAspect: 320 / 240,
    zoom: 1,
    pan: { x: 0, y: 0 },
    objects: [],
    mouseHandlers: noopMouseHandlers,
    cursor: 'crosshair',
  },
  render: () => (
    <StorybookPage
      title="LabelingCanvas"
      description="어노테이션 캔버스 셸 — 이미지 + zoom/pan 변환 + DrawingLayer(객체/프리뷰/핸들) + 마우스 캡처 레이어 + overlays/underlays/floatingOverlays 슬롯. zoom·pan·objects 등 모두 controlled, caller 의 hook(useZoomPan/useDrawingCanvas 등)이 상태 관리."
    >
      <StorybookSection title="기본 캔버스" description="이미지 로드 + 빈 객체 + crosshair 커서 (zoom=1, pan 0,0).">
        <StorybookGrid columns="1fr">
          <StorybookCard title="default" subtitle="objects=[] · zoom=1">
            <div style={HOST}>
              <LabelingCanvas
                imageUrl={SAMPLE_IMAGE}
                alt="Sample labeling image"
                imageAspect={320 / 240}
                zoom={1}
                pan={{ x: 0, y: 0 }}
                objects={[]}
                mouseHandlers={noopMouseHandlers}
                cursor="crosshair"
              />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
