import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Tabs } from './tabs'
import { StorybookCard, StorybookGrid } from '@storybook-support/storybook-layout'

const items = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity' },
  { value: 'permissions', label: 'Permissions' },
]

const meta = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      test: 'error',
    },
  },
  args: {
    items,
    value: 'overview',
    onChange: () => undefined,
    variant: 'pill',
  },
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = React.useState('overview')

    return <Tabs {...args} value={value} onChange={setValue} />
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Activity' }))
    await expect(canvas.getByRole('button', { name: 'Activity' })).toBeInTheDocument()
  },
}

export const Review: Story = {
  render: (args) => {
    const [pillValue, setPillValue] = React.useState('activity')
    const [underlineValue, setUnderlineValue] = React.useState('permissions')

    return (
      <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
        <StorybookCard title="Pill variant" subtitle="툴바나 좁은 panel 내부">
          <Tabs {...args} value={pillValue} onChange={setPillValue} variant="pill" />
        </StorybookCard>
        <StorybookCard title="Underline variant" subtitle="페이지 상단 navigation">
          <Tabs {...args} value={underlineValue} onChange={setUnderlineValue} variant="underline" />
        </StorybookCard>
      </StorybookGrid>
    )
  },
}
