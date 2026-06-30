import type { Meta, StoryObj } from '@storybook/react-vite'
import { ColorEditorPlane } from './color-editor-plane'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Forms/ColorEditorPlane',
  component: ColorEditorPlane,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ColorEditorPlane>

export default meta

type Story = StoryObj<typeof meta>

const PLANE_BOX = { width: 'var(--ig-popup-2xs)' }

export const Review: Story = {
  args: { color: { h: 210, s: 80, l: 55 }, onChange: () => {} },
  render: () => (
    <StorybookPage
      title="ColorEditorPlane"
      description="Saturation/Lightness 2D 픽킹 평면. controlled — color(HslColor) + onChange. 포인터 드래그로 채도(가로)·명도(세로)를 조정하고 thumb 가 현재 값 위치를 표시. ColorEditorPopover 내부의 평면 부품."
    >
      <StorybookSection title="색상별 평면" description="hue 가 다르면 평면 그라데이션이 바뀐다. thumb 위치 = (s, l).">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-2xs), 1fr))">
          <StorybookCard title="blue" subtitle="h=210 s=80 l=55">
            <div style={PLANE_BOX}>
              <ColorEditorPlane color={{ h: 210, s: 80, l: 55 }} onChange={() => {}} />
            </div>
          </StorybookCard>
          <StorybookCard title="green" subtitle="h=140 s=60 l=45">
            <div style={PLANE_BOX}>
              <ColorEditorPlane color={{ h: 140, s: 60, l: 45 }} onChange={() => {}} />
            </div>
          </StorybookCard>
          <StorybookCard title="magenta" subtitle="h=320 s=90 l=60">
            <div style={PLANE_BOX}>
              <ColorEditorPlane color={{ h: 320, s: 90, l: 60 }} onChange={() => {}} />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
