import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { PopoverTriggerField } from './popover-trigger-field'
import { MenuItem } from '../overlays/menu-item'
import { Button } from './button'
import { StorybookCard, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/PopoverTriggerField',
  component: PopoverTriggerField,
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof PopoverTriggerField>

export default meta
type Story = StoryObj<typeof meta>

const OPTIONS = ['Newest first', 'Oldest first', 'Name A–Z', 'Name Z–A']

function Demo() {
  const [open, setOpen] = useState(true)
  const [value, setValue] = useState(OPTIONS[0])
  return (
    <PopoverTriggerField
      open={open}
      onOpenChange={setOpen}
      menuRole="listbox"
      trigger={<Button variant="secondary" onClick={() => setOpen((v) => !v)}>{value}</Button>}
    >
      {OPTIONS.map((o) => (
        <MenuItem key={o} role="option" aria-selected={o === value} onClick={() => { setValue(o); setOpen(false) }}>
          {o}
        </MenuItem>
      ))}
    </PopoverTriggerField>
  )
}

export const Review: Story = {
  args: { open: false, onOpenChange: () => {}, trigger: null, children: null },
  render: () => (
    <StorybookPage
      title="PopoverTriggerField"
      description="트리거 + 포털 팝오버. 메뉴 폭을 트리거 폭에 맞춘다(select/menu 패턴). 뷰포트 경계 안에서 위/아래 자동 배치, 외부클릭·ESC 로 닫힘. 자기 폭을 갖는 패널은 FloatingPanelField 사용."
    >
      <StorybookSection title="open 상태" description="트리거 폭에 맞춘 listbox 팝오버. 기본 열림.">
        <StorybookCard title="trigger + popover" subtitle="open=true · role=listbox">
          <Demo />
        </StorybookCard>
      </StorybookSection>
    </StorybookPage>
  ),
}
