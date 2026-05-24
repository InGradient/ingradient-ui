import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateRangeField } from './date-range-field'

const meta: Meta<typeof DateRangeField> = {
  title: 'Patterns/Shells/DateRangeField',
  component: DateRangeField,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

function Demo() {
  const [range, setRange] = useState({ from: '', to: '' })
  return <DateRangeField from={range.from} to={range.to} onChange={setRange} />
}

export const Default: Story = { render: () => <Demo /> }
export const WithValue: Story = {
  args: { from: '2024-12-01', to: '2024-12-31', onChange: () => undefined },
}
