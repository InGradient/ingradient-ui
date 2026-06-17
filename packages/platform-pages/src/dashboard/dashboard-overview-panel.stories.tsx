import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { DateRange } from 'react-day-picker'
import { DashboardOverviewPanel } from './dashboard-overview-panel'
import { DateRangePicker, type DateRangePickerValue } from '@ingradient/ui/components'

const meta: Meta<typeof DashboardOverviewPanel> = {
  title: 'Platform Pages/Dashboard/DashboardOverviewPanel',
  component: DashboardOverviewPanel,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ padding: 24, background: 'var(--ig-color-bg-canvas)', minHeight: 600 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const noop = () => undefined

export const NoProject: Story = {
  args: {
    state: 'no-project',
    hint: 'Select a project to load stats',
    dateLabel: 'All time',
    onToggleDate: noop, onResetLayout: noop,
  },
}

export const Loading: Story = {
  args: {
    state: 'loading',
    hint: 'Current project stats · 2026-05-01 → 2026-05-14',
    dateLabel: '2026-05-01 → 2026-05-14',
    onToggleDate: noop, onResetLayout: noop,
  },
}

export const ErrorState: Story = {
  args: {
    state: 'error',
    hint: 'Current project stats · All time',
    dateLabel: 'All time',
    errorMessage: 'Failed to load analysis. Try again.',
    onToggleDate: noop, onResetLayout: noop,
  },
}

export const NoData: Story = {
  args: {
    state: 'data',
    hint: 'Current project stats · All time',
    dateLabel: 'All time',
    onToggleDate: noop, onResetLayout: noop,
  },
}

export const WithBody: Story = {
  args: {
    state: 'data',
    hint: 'Current project stats · 2026-05-01 → 2026-05-14',
    dateLabel: '2026-05-01 → 2026-05-14',
    onToggleDate: noop, onResetLayout: noop,
    children: <div style={{ padding: 16, background: 'var(--ig-color-surface-raised)', borderRadius: 8, color: 'var(--ig-color-text-muted)' }}>(Analysis dashboard goes here — Phase 3)</div>,
  },
}

export const WithDatePopoverOpen: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    const [draft, setDraft] = useState<DateRange | undefined>(undefined)
    return (
      <DashboardOverviewPanel
        state="data"
        hint="Current project stats · All time"
        dateLabel="All time"
        onToggleDate={() => setOpen((v) => !v)}
        onResetLayout={noop}
        datePopover={
          open ? (
            <DateRangePicker
              mode="range"
              value={draft}
              onChange={(next: DateRangePickerValue) => setDraft(next as DateRange | undefined)}
              onReset={() => setDraft(undefined)}
              onApply={() => setOpen(false)}
              summaryLabel={draft?.from ? `${draft.from.toISOString().slice(0, 10)} → ${(draft.to ?? draft.from).toISOString().slice(0, 10)}` : 'All time'}
              title="Overview Date Range"
            />
          ) : null
        }
      >
        <div style={{ padding: 16, color: 'var(--ig-color-text-muted)' }}>Body content</div>
      </DashboardOverviewPanel>
    )
  },
}
