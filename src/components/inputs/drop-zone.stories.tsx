import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { DropZone } from './drop-zone'

const meta = {
  title: 'Components/Inputs/DropZone',
  component: DropZone,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
} satisfies Meta<typeof DropZone>

export default meta

type Story = StoryObj<typeof meta>

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    style: { padding: 'var(--ig-space-10) var(--ig-space-6)' },
    children: 'Drop files here or click to browse',
  },
}

export const OutlinedActive: Story = {
  args: {
    variant: 'outlined',
    active: true,
    style: { padding: 'var(--ig-space-10) var(--ig-space-6)' },
    children: 'Release to drop',
  },
}

export const OutlinedDisabled: Story = {
  args: {
    variant: 'outlined',
    disabled: true,
    style: { padding: 'var(--ig-space-10) var(--ig-space-6)' },
    children: 'Upload disabled',
  },
}

export const Filled: Story = {
  args: {
    variant: 'filled',
    style: { padding: 'var(--ig-space-9)', minHeight: 140 },
    children: 'Drag reference image here',
  },
}

export const Interactive: Story = {
  args: { children: '' },
  render: () => {
    const [active, setActive] = useState(false)
    return (
      <DropZone
        variant="outlined"
        active={active}
        style={{ padding: 'var(--ig-space-10) var(--ig-space-6)' }}
        onDragEnter={(e) => { e.preventDefault(); setActive(true) }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setActive(false)}
        onDrop={(e) => { e.preventDefault(); setActive(false) }}
      >
        {active ? 'Release to drop' : 'Drag a file from your desktop'}
      </DropZone>
    )
  },
}
