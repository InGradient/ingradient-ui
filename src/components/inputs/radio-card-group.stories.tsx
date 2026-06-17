import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioCardGroup } from './radio-card-group'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/RadioCardGroup',
  component: RadioCardGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof RadioCardGroup>

export default meta

type Story = StoryObj<typeof meta>

const taskTypeOptions = [
  { value: 'classification', label: 'Classification' },
  { value: 'object_detection', label: 'Object Detection' },
  { value: 'segmentation', label: 'Segmentation — coming soon', disabled: true },
  { value: 'point', label: 'Point' },
]

const simpleOptions = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
]

export const Review: Story = {
  args: { options: [], value: '', onChange: () => undefined },
  render: () => {
    const [taskType, setTaskType] = React.useState('object_detection')
    const [simple, setSimple] = React.useState('b')

    return (
      <StorybookPage
        title="RadioCardGroup"
        description="Vertical option group for form questions (e.g. Task Type in Add Dataset). Each option is a full-width selectable card with active/disabled state. Use for 2-6 options where the choice is meaningful and labels need to be readable."
      >
        <StorybookSection title="Variants" description="Task type form, simple options, and per-option disabled state.">
          <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
            <StorybookCard title="Task type" subtitle="real form use case (with disabled option)">
              <RadioCardGroup
                options={taskTypeOptions}
                value={taskType}
                onChange={setTaskType}
              />
            </StorybookCard>
            <StorybookCard title="Simple options" subtitle="3 options, all enabled">
              <RadioCardGroup
                options={simpleOptions}
                value={simple}
                onChange={setSimple}
              />
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
