import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ModelMappingSelect } from './model-mapping-select'
import { COCO_CLASS_NAMES } from '../../../stories/fixtures/platform/0.0.1/coco-class-names'

const meta: Meta<typeof ModelMappingSelect> = {
  title: 'Patterns/Shells/ModelMappingSelect',
  component: ModelMappingSelect,
  decorators: [(Story) => <div style={{ width: 268, padding: 16, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const NotMapped: Story = {
  args: { enabled: true, options: [...COCO_CLASS_NAMES], value: '' },
}

export const MappedToPerson: Story = {
  args: { enabled: true, options: [...COCO_CLASS_NAMES], value: 'person' },
}

export const Disabled: Story = {
  args: { enabled: false, options: [...COCO_CLASS_NAMES] },
}

export const Interactive: Story = {
  render: () => {
    const [v, setV] = useState('cat')
    return <ModelMappingSelect enabled options={[...COCO_CLASS_NAMES]} value={v} onChange={setV} />
  },
}
