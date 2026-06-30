import type { Meta, StoryObj } from '@storybook/react-vite'
import { ColorEditorPopover } from './color-editor-popover'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Forms/ColorEditorPopover',
  component: ColorEditorPopover,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ColorEditorPopover>

export default meta

type Story = StoryObj<typeof meta>

// Popover 는 position:absolute (top calc(100% + ...)) 라 relative anchor + 아래 여백 필요.
const ANCHOR = { position: 'relative' as const, width: 'var(--ig-popup-xs)', minHeight: 'var(--ig-popup-md)' }

export const Review: Story = {
  args: {
    color: { h: 210, s: 80, l: 55 },
    hexDraft: '#3d8bff',
    onChange: () => {},
    onChangeHexDraft: () => {},
    onCommitHex: () => {},
    onClose: () => {},
  },
  render: () => (
    <StorybookPage
      title="ColorEditorPopover"
      description="색상 편집 팝오버 패널 — Plane + hex 입력 + Random 버튼 + Hue/Saturation/Lightness 슬라이더/숫자 입력 + Done. controlled: color/hexDraft 상태와 onChange/onChangeHexDraft/onCommitHex/onRandomize/onClose 콜백을 caller 가 관리."
    >
      <StorybookSection title="편집 패널" description="anchor 기준 절대 위치로 펼쳐진 상태. onRandomize 유무 비교.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
          <StorybookCard title="with randomize" subtitle="onRandomize 제공">
            <div style={ANCHOR}>
              <ColorEditorPopover
                color={{ h: 210, s: 80, l: 55 }}
                hexDraft="#3d8bff"
                onChange={() => {}}
                onChangeHexDraft={() => {}}
                onCommitHex={() => {}}
                onRandomize={() => {}}
                onClose={() => {}}
              />
            </div>
          </StorybookCard>
          <StorybookCard title="no randomize" subtitle="onRandomize 생략">
            <div style={ANCHOR}>
              <ColorEditorPopover
                color={{ h: 140, s: 65, l: 48 }}
                hexDraft="#2bbd6a"
                onChange={() => {}}
                onChangeHexDraft={() => {}}
                onCommitHex={() => {}}
                onClose={() => {}}
              />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
