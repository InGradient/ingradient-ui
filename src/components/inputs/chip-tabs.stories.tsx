import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChipTabs, type ChipTabsItem } from './chip-tabs'

const siblings: ChipTabsItem[] = [
  { id: 's1', pattern_label: 'solid' },
  { id: 's2', pattern_label: 'black' },
  { id: 's3', pattern_label: 'x_phase_0_of_3' },
  { id: 's4', pattern_label: 'x_phase_1_of_3' },
  { id: 's5', pattern_label: 'x_phase_2_of_3' },
  { id: 's6', pattern_label: 'y_phase_0_of_3' },
]

const meta: Meta<typeof ChipTabs> = {
  title: 'Components/Inputs/ChipTabs',
  component: ChipTabs,
  decorators: [(Story) => <div style={{ padding: 16, background: 'var(--ig-color-overlay-darkest)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const FullSet: Story = { args: { items: siblings, currentId: 's3', onSelect: () => undefined } }

export const SingleHidden: Story = { args: { items: [siblings[0]], currentId: 's1', onSelect: () => undefined } }

export const PlainNames: Story = {
  args: {
    items: [
      { id: 'a', name: 'image-1.jpg' },
      { id: 'b', name: 'image-2.jpg' },
      { id: 'c', name: 'image-3.jpg' },
    ],
    currentId: 'b',
    onSelect: () => undefined,
  },
}

export const Interactive: Story = {
  render: () => {
    const [current, setCurrent] = useState('s3')
    return <ChipTabs items={siblings} currentId={current} onSelect={(s) => setCurrent(s.id)} />
  },
}
