import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SortPopoverTrigger } from './sort-popover-trigger'

const meta: Meta<typeof SortPopoverTrigger> = {
  title: 'Patterns/SortPopoverTrigger',
  component: SortPopoverTrigger,
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj<typeof meta>

const OPTIONS = [
  { value: 'recent', label: 'Most recent' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'size', label: 'File size' },
  { value: 'labeled', label: 'Labeled status' },
]

function Demo() {
  const [value, setValue] = useState('recent')
  return <SortPopoverTrigger options={OPTIONS} value={value} onChange={setValue} />
}

export const Default: Story = { render: () => <Demo /> }
export const OpenByDefault: Story = {
  render: () => {
    const [value, setValue] = useState('recent')
    return <SortPopoverTrigger options={OPTIONS} value={value} onChange={setValue} defaultOpen />
  },
}
