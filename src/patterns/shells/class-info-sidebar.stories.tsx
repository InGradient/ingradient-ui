import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ClassInfoSidebar } from './class-info-sidebar'
import { ClassInfoSection } from './class-info-section'

import type { ClassInfoSidebarClass } from './class-info-sidebar'

const baseClass: ClassInfoSidebarClass = { id: 'c-1', name: 'Crack', color: '#ef4444', description: 'Surface micro-crack defect' }

const meta: Meta<typeof ClassInfoSidebar> = {
  title: 'Patterns/Shells/ClassInfoSidebar',
  component: ClassInfoSidebar,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ height: 700, display: 'flex' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { selectedClass: baseClass },
}

export const NoDescription: Story = {
  args: { selectedClass: { ...baseClass, name: 'Stain', color: '#3b82f6', description: null } },
}

export const WithSlots: Story = {
  args: {
    selectedClass: baseClass,
    referenceImageSlot: (
      <ClassInfoSection title="Reference image">
        <div style={{ height: 180, border: '1px dashed var(--ig-color-border-strong)', borderRadius: 8, background: 'var(--ig-color-surface-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ig-color-text-muted)', fontSize: 12 }}>
          (Reference image drop zone — Phase 4)
        </div>
      </ClassInfoSection>
    ),
    mappingSlot: (
      <ClassInfoSection title="Model mapping">
        <span style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>Map this class to the detection model's class (COCO) for auto-labeling.</span>
      </ClassInfoSection>
    ),
  },
}

export const Interactive: Story = {
  render: () => {
    const [c, setC] = useState(baseClass)
    return (
      <ClassInfoSidebar
        selectedClass={c}
        onChangeName={(name) => setC((prev) => ({ ...prev, name }))}
        onChangeColor={(color) => setC((prev) => ({ ...prev, color }))}
        onChangeDescription={(description) => setC((prev) => ({ ...prev, description: description ?? null }))}
        onRandomizeColor={() => {
          const hex = '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')
          setC((prev) => ({ ...prev, color: hex }))
        }}
        onDelete={() => undefined}
      />
    )
  },
}
