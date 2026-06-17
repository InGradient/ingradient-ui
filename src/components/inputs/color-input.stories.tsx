import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ColorInput } from './color-input'

const meta = {
  title: 'Components/Inputs/ColorInput',
  component: ColorInput,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ColorInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { defaultValue: '#4d88ff' },
}

export const Disabled: Story = {
  args: { defaultValue: '#888888', disabled: true },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('#22c55e')
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-5)' }}>
        <ColorInput value={value} onChange={(e) => setValue(e.target.value)} />
        <span style={{ fontFamily: 'monospace', color: 'var(--ig-color-text-muted)' }}>{value}</span>
      </div>
    )
  },
}
