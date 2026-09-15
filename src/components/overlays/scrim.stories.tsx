import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Scrim } from './scrim'
import { Button } from '../inputs/button'

const meta = {
  title: 'Components/Overlays/Scrim',
  component: Scrim,
  tags: ['autodocs'],
} satisfies Meta<typeof Scrim>

export default meta
type Story = StoryObj<typeof meta>

/** 부모가 position: relative 여야 한다. */
export const OverContent: Story = {
  args: { children: <Button variant="accent">Calculate</Button> },
  render: (args) => (
    <div style={{
      position: 'relative', height: 220, display: 'grid', placeItems: 'center',
      background: 'var(--ig-color-surface-sunken)', color: 'var(--ig-color-text-muted)',
    }}>
      가려지는 내용
      <Scrim {...args} />
    </div>
  ),
}
