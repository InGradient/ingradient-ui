import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { FloatingPanelField } from './floating-panel-field'
import { Button } from './button'
import { StorybookCard, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/FloatingPanelField',
  component: FloatingPanelField,
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof FloatingPanelField>

export default meta
type Story = StoryObj<typeof meta>

const PANEL_STYLE = {
  width: 'var(--ig-popup-md)',
  padding: 'var(--ig-space-5)',
  background: 'var(--ig-color-surface-raised)',
  border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
  borderRadius: 'var(--ig-radius-md)',
  boxShadow: 'var(--ig-shadow-menu)',
  zIndex: 'var(--ig-z-popover)',
  color: 'var(--ig-color-text-secondary)',
  fontSize: 'var(--ig-font-size-sm)',
} as const

function Demo() {
  const [open, setOpen] = useState(true)
  return (
    <FloatingPanelField
      open={open}
      onOpenChange={setOpen}
      trigger={<Button variant="secondary" onClick={() => setOpen((v) => !v)}>{open ? 'Close panel' : 'Open panel'}</Button>}
    >
      {({ style, ref }) => (
        <div ref={ref} style={{ ...style, ...PANEL_STYLE }}>
          자기 폭을 직접 갖는 패널(달력·컬러피커 등). 트리거 폭에 맞추지 않고 뷰포트 경계 안에서 위/아래 자동 배치.
        </div>
      )}
    </FloatingPanelField>
  )
}

export const Review: Story = {
  args: { open: false, onOpenChange: () => {}, trigger: null, children: () => null },
  render: () => (
    <StorybookPage
      title="FloatingPanelField"
      description="트리거 + 포털 패널. 패널이 자기 폭을 갖는 경우(달력·컬러피커·라이브러리 위젯)용 — 트리거 폭을 강제하지 않는다. 뷰포트 경계로 위/아래 자동 결정, 외부클릭·ESC 로 닫힘. PopoverTriggerField(트리거 폭 매칭)의 짝."
    >
      <StorybookSection title="open 상태" description="버튼으로 토글. 기본 열림으로 패널 표시.">
        <StorybookCard title="trigger + floating panel" subtitle="open=true">
          <Demo />
        </StorybookCard>
      </StorybookSection>
    </StorybookPage>
  ),
}
