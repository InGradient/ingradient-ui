import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { DateRange } from 'react-day-picker'
import { DateRangePicker, type DateRangePickerValue } from './date-range-picker'

const meta: Meta<typeof DateRangePicker> = {
  title: 'Components/Inputs/DateRangePicker',
  component: DateRangePicker,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ position: 'relative', minHeight: 720, padding: 24 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

function formatRange(v: DateRangePickerValue): string {
  if (!v) return 'All time'
  if (v instanceof Date) return v.toLocaleDateString()
  const { from, to } = v as DateRange
  if (!from) return 'All time'
  if (!to || from.getTime() === to.getTime()) return from.toLocaleDateString()
  return `${from.toLocaleDateString()} — ${to.toLocaleDateString()}`
}

const today = () => new Date()
const last7Days = (): DateRange => {
  const to = new Date()
  const from = new Date(to)
  from.setDate(from.getDate() - 6)
  return { from, to }
}
const thisMonth = (): DateRange => {
  const now = new Date()
  return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now }
}

export const RangeWithPresets: Story = {
  render: () => {
    const [value, setValue] = useState<DateRangePickerValue>(undefined)
    const [applied, setApplied] = useState<string>('All time')
    return (
      <DateRangePicker
        mode="range"
        value={value}
        onChange={setValue}
        presets={[
          { id: 'today', label: 'Today', resolve: () => today() },
          { id: 'last7', label: 'Last 7 days', resolve: () => last7Days() },
          { id: 'thisMonth', label: 'This month', resolve: () => thisMonth() },
        ]}
        title="Overview Date Range"
        subtitle="Filter all Project Overview widgets by created date."
        summaryLabel={`Current: ${applied} · Draft: ${formatRange(value)}`}
        footerHint="Saved per user and restored on next visit."
        onReset={() => { setValue(undefined); setApplied('All time') }}
        onApply={() => setApplied(formatRange(value))}
      />
    )
  },
}

export const SingleDay: Story = {
  render: () => {
    const [value, setValue] = useState<DateRangePickerValue>(undefined)
    return (
      <DateRangePicker
        mode="single"
        value={value}
        onChange={setValue}
        title="Pick a date"
        summaryLabel={formatRange(value)}
      />
    )
  },
}

export const NoPresets: Story = {
  render: () => {
    const [value, setValue] = useState<DateRangePickerValue>(undefined)
    return (
      <DateRangePicker
        mode="range"
        value={value}
        onChange={setValue}
        title="Custom range"
        summaryLabel={formatRange(value)}
      />
    )
  },
}
