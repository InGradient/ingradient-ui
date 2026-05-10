import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DropdownSelect } from './dropdown-select'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/DropdownSelect',
  component: DropdownSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof DropdownSelect>

export default meta

type Story = StoryObj<typeof meta>

const taskOptions = [
  { value: 'classification', label: 'Classification' },
  { value: 'object_detection', label: 'Object Detection' },
  { value: 'segmentation', label: 'Segmentation' },
  { value: 'point', label: 'Point' },
]

const datePresets = [
  { value: 'all', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: 'last7', label: 'Last 7 days' },
  { value: 'last30', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom range' },
]

const longList = [
  { value: 'a', label: 'Alpha — first option in the list' },
  { value: 'b', label: 'Bravo' },
  { value: 'c', label: 'Charlie — middle option' },
  { value: 'd', label: 'Delta' },
  { value: 'e', label: 'Echo — last option' },
]

export const Review: Story = {
  args: { value: '', options: [], onChange: () => undefined },
  render: () => {
    const [task, setTask] = React.useState('object_detection')
    const [date, setDate] = React.useState('last7')
    const [long, setLong] = React.useState('a')

    return (
      <StorybookPage
        title="DropdownSelect"
        description="Single-select dropdown with controlled value. Click trigger → menu opens. Click outside or select to close."
      >
        <StorybookSection title="Variants" description="Common form use cases.">
          <StorybookGrid columns="repeat(auto-fit, minmax(260px, 1fr))">
            <StorybookCard title="Task type" subtitle="4 options">
              <DropdownSelect value={task} options={taskOptions} onChange={setTask} />
            </StorybookCard>
            <StorybookCard title="Date preset" subtitle="5 options including 'Custom range'">
              <DropdownSelect value={date} options={datePresets} onChange={setDate} />
            </StorybookCard>
            <StorybookCard title="Long labels" subtitle="text wraps within trigger">
              <DropdownSelect value={long} options={longList} onChange={setLong} />
            </StorybookCard>
            <StorybookCard title="Disabled">
              <DropdownSelect value={task} options={taskOptions} onChange={setTask} disabled />
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
