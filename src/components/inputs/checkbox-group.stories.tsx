import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CheckboxGroup } from './checkbox-group'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof CheckboxGroup>

export default meta

type Story = StoryObj<typeof meta>

const colorItems = [
  { id: 'defect', label: 'Defect', color: '#ef4444' },
  { id: 'crack', label: 'Crack', color: '#f97316' },
  { id: 'stain', label: 'Stain', color: '#eab308' },
  { id: 'scratch', label: 'Scratch', color: '#22c55e' },
  { id: 'dent', label: 'Dent', color: '#3b82f6' },
  { id: 'rust', label: 'Rust', color: '#a855f7' },
]

const plainItems = [
  { id: 'opt-1', label: 'Option 1' },
  { id: 'opt-2', label: 'Option 2' },
  { id: 'opt-3', label: 'Option 3' },
]

export const Review: Story = {
  args: { items: [], selectedIds: new Set(), onChange: () => undefined },
  render: () => {
    const [selectedColor, setSelectedColor] = React.useState(new Set<string>(['defect', 'crack']))
    const [selectedPlain, setSelectedPlain] = React.useState(new Set<string>(['opt-2']))

    return (
      <StorybookPage
        title="CheckboxGroup"
        description="Checkbox list with optional color swatch and Select All / Deselect All header. Used for class selection in Add Dataset flow and similar multi-select use cases."
      >
        <StorybookSection title="Variants" description="With color swatch, plain labels, and Select All hidden.">
          <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
            <StorybookCard title="With color swatch" subtitle="domain class selection">
              <CheckboxGroup
                items={colorItems}
                selectedIds={selectedColor}
                onChange={setSelectedColor}
              />
            </StorybookCard>
            <StorybookCard title="Plain labels" subtitle="no color, simple option list">
              <CheckboxGroup
                items={plainItems}
                selectedIds={selectedPlain}
                onChange={setSelectedPlain}
              />
            </StorybookCard>
            <StorybookCard title="No Select All" subtitle="showSelectAll={false}">
              <CheckboxGroup
                items={plainItems}
                selectedIds={selectedPlain}
                onChange={setSelectedPlain}
                showSelectAll={false}
              />
            </StorybookCard>
            <StorybookCard title="Custom maxHeight" subtitle="200px (longer scroll area)">
              <CheckboxGroup
                items={colorItems}
                selectedIds={selectedColor}
                onChange={setSelectedColor}
                maxHeight={200}
              />
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
