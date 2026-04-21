import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { SearchField } from './search-field'
import { StorybookCard, StorybookGrid, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      test: 'error',
    },
  },
  args: {
    placeholder: 'Search labels, comments, or files',
    size: 'md',
  },
} satisfies Meta<typeof SearchField>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = React.useState('bounding-box')

    return (
      <SearchField
        {...args}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onClear={() => setValue('')}
      />
    )
  },
  play: async ({ canvas, userEvent }) => {
    const searchbox = canvas.getByRole('searchbox')

    await userEvent.clear(searchbox)
    await userEvent.type(searchbox, 'review queue')
    await expect(searchbox).toHaveValue('review queue')

    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }))
    await expect(searchbox).toHaveValue('')
  },
}

export const Review: Story = {
  render: (args) => {
    const [primary, setPrimary] = React.useState('')
    const [dense, setDense] = React.useState('medical-report-long-filename')

    return (
      <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
        <StorybookCard title="Empty" subtitle="초기 진입 상태">
          <SearchField {...args} value={primary} onChange={(event) => setPrimary(event.target.value)} onClear={() => setPrimary('')} />
        </StorybookCard>
        <StorybookCard title="With content" subtitle="clear action이 보이는 상태">
          <SearchField {...args} value={dense} onChange={(event) => setDense(event.target.value)} onClear={() => setDense('')} />
        </StorybookCard>
        <StorybookCard title="Compact" subtitle="toolbar나 dense filter row에 맞는 크기">
          <StorybookStack>
            <SearchField {...args} size="sm" value="compact" onChange={() => undefined} onClear={() => undefined} />
          </StorybookStack>
        </StorybookCard>
      </StorybookGrid>
    )
  },
}
