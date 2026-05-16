import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { DateRange } from 'react-day-picker'
import { DashboardDateRangePopover } from './dashboard-date-range-popover'

const meta: Meta<typeof DashboardDateRangePopover> = {
  title: 'Patterns/Shells/DashboardDateRangePopover',
  component: DashboardDateRangePopover,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ position: 'relative', padding: 80, background: 'var(--ig-color-surface-panel)', minHeight: 600 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const noop = () => undefined

export const Empty: Story = {
  args: {
    open: true, dateDraft: undefined,
    onChangeDraft: noop, onSelectPreset: noop, onReset: noop, onApply: noop,
  },
}

export const WithRange: Story = {
  args: {
    open: true,
    dateDraft: { from: new Date(2026, 4, 1), to: new Date(2026, 4, 14) },
    summaryLabel: '2026-05-01 → 2026-05-14',
    onChangeDraft: noop, onSelectPreset: noop, onReset: noop, onApply: noop,
  },
}

export const Closed: Story = {
  args: {
    open: false, dateDraft: undefined,
    onChangeDraft: noop, onSelectPreset: noop, onReset: noop, onApply: noop,
  },
}

export const Interactive: Story = {
  render: () => {
    const [draft, setDraft] = useState<DateRange | undefined>(undefined)
    const summary = draft?.from
      ? `${draft.from.toISOString().slice(0, 10)} → ${(draft.to ?? draft.from).toISOString().slice(0, 10)}`
      : 'All time'
    return (
      <DashboardDateRangePopover
        open
        dateDraft={draft}
        onChangeDraft={setDraft}
        onSelectPreset={(p) => {
          const today = new Date()
          if (p === 'today') setDraft({ from: today, to: today })
          else if (p === 'last7') setDraft({ from: new Date(today.getTime() - 6 * 86400000), to: today })
          else setDraft({ from: new Date(today.getFullYear(), today.getMonth(), 1), to: today })
        }}
        onReset={() => setDraft(undefined)}
        onApply={noop}
        summaryLabel={summary}
      />
    )
  },
}
