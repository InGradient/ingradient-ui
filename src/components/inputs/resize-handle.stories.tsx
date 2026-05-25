import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ResizeHandle } from './resize-handle'

const meta = {
  title: 'Components/Inputs/ResizeHandle',
  component: ResizeHandle,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ResizeHandle>

export default meta

type Story = StoryObj<typeof meta>

export const VerticalSplit: Story = {
  render: () => {
    const [leftW, setLeftW] = useState(220)
    const startResize = (e: React.MouseEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const startW = leftW
      const move = (ev: MouseEvent) => setLeftW(Math.min(480, Math.max(120, startW + (ev.clientX - startX))))
      const stop = () => {
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseup', stop)
      }
      window.addEventListener('mousemove', move)
      window.addEventListener('mouseup', stop)
    }
    return (
      <div style={{ display: 'flex', height: 240, background: 'var(--ig-color-bg-canvas)' }}>
        <aside style={{ width: leftW, background: 'var(--ig-color-surface-panel)', padding: 16 }}>
          Left ({leftW}px)
        </aside>
        <ResizeHandle orientation="vertical" onMouseDown={startResize} />
        <main style={{ flex: 1, padding: 16 }}>Right — drag the handle to resize</main>
      </div>
    )
  },
}

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  decorators: [
    (Story) => (
      <div style={{ height: 24, background: 'var(--ig-color-surface-panel)' }}>
        <Story />
      </div>
    ),
  ],
}
