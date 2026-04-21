import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { SelectField } from './select-field'
import { StorybookCard, StorybookGrid } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/SelectField',
  component: SelectField,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      test: 'error',
    },
  },
} satisfies Meta<typeof SelectField>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => {
    const [value, setValue] = React.useState('review')

    return (
      <div style={{ maxWidth: 320 }}>
        <SelectField value={value} onChange={(event) => setValue(event.target.value)}>
          <option value="draft">Draft</option>
          <option value="review">In review</option>
          <option value="published">Published</option>
        </SelectField>
      </div>
    )
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'In review' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Published' }))
    await expect(canvas.getByRole('button', { name: 'Published' })).toBeInTheDocument()
  },
}

export const Review: Story = {
  render: () => {
    const [status, setStatus] = React.useState('active')
    const [filter, setFilter] = React.useState('all')

    return (
      <StorybookGrid columns="repeat(auto-fit, minmax(260px, 1fr))">
        <StorybookCard title="Form field" subtitle="단일 상태 선택">
          <SelectField value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="archived">Archived</option>
          </SelectField>
        </StorybookCard>
        <StorybookCard title="Filter select" subtitle="toolbar filter에서 쓰는 형태">
          <SelectField value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">All items</option>
            <option value="mine">Assigned to me</option>
            <option value="blocked">Blocked</option>
          </SelectField>
        </StorybookCard>
      </StorybookGrid>
    )
  },
}
