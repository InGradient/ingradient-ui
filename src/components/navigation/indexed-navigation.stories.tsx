import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { IndexedNavigation } from './indexed-navigation'

const meta: Meta<typeof IndexedNavigation> = {
  title: 'Components/Navigation/IndexedNavigation',
  component: IndexedNavigation,
  decorators: [(Story) => <div style={{ padding: 16, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const First: Story = { args: { index: 0, total: 4, onChange: () => undefined } }
export const Middle: Story = { args: { index: 2, total: 4, onChange: () => undefined } }
export const Last: Story = { args: { index: 3, total: 4, onChange: () => undefined } }
export const SingleHidden: Story = { args: { index: 0, total: 1, onChange: () => undefined } }

export const Interactive: Story = {
  render: () => {
    const [i, setI] = useState(0)
    return <IndexedNavigation index={i} total={5} onChange={setI} />
  },
}
