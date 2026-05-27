import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ClassLightbox, type ClassLightboxItem } from './class-lightbox'
import sample1 from '../../../stories/assets/20230808.jpg'
import sample2 from '../../../stories/assets/20230816.jpg'

const classIdToColor = { 'c-1': '#ef4444', 'c-2': '#f59e0b' }

const baseItem: ClassLightboxItem = {
  id: 'img-1',
  name: 'wafer-001.jpg',
  width: 1024,
  height: 768,
  bboxes: [
    { classId: 'c-1', x: 0.12, y: 0.18, w: 0.32, h: 0.24 },
    { classId: 'c-2', x: 0.55, y: 0.42, w: 0.28, h: 0.18 },
  ],
  points: [{ classId: 'c-1', x: 0.5, y: 0.6 }],
}

const meta: Meta<typeof ClassLightbox> = {
  title: 'Patterns/ClassLightbox',
  component: ClassLightbox,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

export const Single: Story = {
  args: {
    open: true,
    item: baseItem,
    imageUrl: sample1 as string,
    classIdToColor,
    onClose: () => undefined,
  },
}

export const FilteredByClass: Story = {
  args: {
    open: true,
    item: baseItem,
    imageUrl: sample1 as string,
    classIdToColor,
    selectedClassId: 'c-1',
    onClose: () => undefined,
  },
}

export const NoAnnotations: Story = {
  args: {
    open: true,
    item: { id: 'img-2', name: 'clean.jpg', width: 1024, height: 768, bboxes: [], points: [] },
    imageUrl: sample2 as string,
    onClose: () => undefined,
  },
}

export const WithPatternTabs: Story = {
  render: () => {
    const siblings: ClassLightboxItem[] = [
      { ...baseItem, id: 's1', pattern_label: 'solid' },
      { ...baseItem, id: 's2', pattern_label: 'x_phase_0_of_3' },
      { ...baseItem, id: 's3', pattern_label: 'x_phase_1_of_3' },
      { ...baseItem, id: 's4', pattern_label: 'x_phase_2_of_3' },
    ]
    const [open, setOpen] = useState(true)
    return (
      <ClassLightbox
        open={open}
        item={siblings[1]}
        imageUrl={sample1 as string}
        siblings={siblings}
        classIdToColor={classIdToColor}
        onClose={() => setOpen(false)}
      />
    )
  },
}

export const Closed: Story = {
  args: { open: false, item: baseItem, imageUrl: sample1 as string, onClose: () => undefined },
}
