import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search } from 'lucide-react'
import { InputAdornment } from './input-adornment'
import { iconSizeNumbers } from '../../tokens/core'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/InputAdornment',
  component: InputAdornment,
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof InputAdornment>

export default meta
type Story = StoryObj<typeof meta>

const HOST_STYLE = { position: 'relative', width: 'var(--ig-popup-xs)' } as const
const INPUT_STYLE = {
  width: '100%',
  height: 'var(--ig-control-height-md)',
  padding: '0 var(--ig-space-9)',
  borderRadius: 'var(--ig-radius-md)',
  border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
  background: 'var(--ig-color-surface-muted)',
  color: 'var(--ig-color-text-primary)',
  boxSizing: 'border-box',
} as const
const HINT_STYLE = { color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-sm)' } as const

export const Review: Story = {
  args: { side: 'left', children: null },
  render: () => (
    <StorybookPage
      title="InputAdornment"
      description="입력 필드 위에 절대배치되는 좌/우 장식 슬롯(아이콘·단위·접두/접미 텍스트). position:relative 인 필드 래퍼 안에서 side·inset 으로 위치, stretchY 로 세로 꽉 채움."
    >
      <StorybookSection title="side / 내용" description="좌측 아이콘, 우측 단위 텍스트, 양쪽 동시.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), max-content))">
          <StorybookCard title="left (아이콘)">
            <div style={HOST_STYLE}>
              <input style={INPUT_STYLE} placeholder="Search…" readOnly />
              <InputAdornment side="left"><Search size={iconSizeNumbers.sm} color="var(--ig-color-text-muted)" /></InputAdornment>
            </div>
          </StorybookCard>
          <StorybookCard title="right (단위 텍스트)">
            <div style={HOST_STYLE}>
              <input aria-label="File size" style={INPUT_STYLE} defaultValue="1024" readOnly />
              <InputAdornment side="right"><span style={HINT_STYLE}>MB</span></InputAdornment>
            </div>
          </StorybookCard>
          <StorybookCard title="both (좌 아이콘 + 우 텍스트)">
            <div style={HOST_STYLE}>
              <input aria-label="Server address" style={INPUT_STYLE} defaultValue="0.0.0.0" readOnly />
              <InputAdornment side="left"><Search size={iconSizeNumbers.sm} color="var(--ig-color-text-muted)" /></InputAdornment>
              <InputAdornment side="right"><span style={HINT_STYLE}>:8080</span></InputAdornment>
            </div>
          </StorybookCard>
          <StorybookCard title="stretchY (세로 꽉)">
            <div style={HOST_STYLE}>
              <input style={INPUT_STYLE} placeholder="With clear button" readOnly />
              <InputAdornment side="right" stretchY><span style={HINT_STYLE}>✕</span></InputAdornment>
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
