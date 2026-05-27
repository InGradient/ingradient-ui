import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ColorInputRow } from './color-input-row'

const meta: Meta<typeof ColorInputRow> = {
  title: 'Patterns/ColorInputRow',
  component: ColorInputRow,
  decorators: [(Story) => <div style={{ padding: 16, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { args: { value: '#ef4444' } }

export const Disabled: Story = { args: { value: '#3b82f6', disabled: true } }

export const Interactive: Story = {
  render: () => {
    const [color, setColor] = useState('#10b981')
    const randomize = () => {
      const hex = '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')
      setColor(hex)
    }
    return <ColorInputRow value={color} onChange={setColor} onRandomize={randomize} />
  },
}
