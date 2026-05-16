import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { emptyGalleryFilterPanelState, GalleryFilterPanel, type GalleryFilterPanelState } from './gallery-filter-panel'

const meta: Meta<typeof GalleryFilterPanel> = {
  title: 'Patterns/GalleryFilterPanel',
  component: GalleryFilterPanel,
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj<typeof meta>

const CLASS_ITEMS = [
  { id: 'cl-1', label: 'Crack', color: '#ff6b6b' },
  { id: 'cl-2', label: 'Scratch', color: '#feca57' },
  { id: 'cl-3', label: 'Dent', color: '#48dbfb' },
  { id: 'cl-4', label: 'Discoloration', color: '#1dd1a1' },
  { id: 'cl-5', label: 'Stain', color: '#a55eea' },
]
const MEMBER_ITEMS = [
  { id: 'mb-1', label: 'June Lee' },
  { id: 'mb-2', label: 'Soyeon Park' },
  { id: 'mb-3', label: 'Daniel Kim' },
]
const PATTERN_ITEMS = [
  { id: 'pt-A', label: 'Pattern A' },
  { id: 'pt-B', label: 'Pattern B' },
  { id: 'pt-C', label: 'Pattern C' },
]

function Demo({ initial }: { initial: GalleryFilterPanelState }) {
  const [state, setState] = useState<GalleryFilterPanelState>(initial)
  return (
    <GalleryFilterPanel
      state={state}
      onChange={setState}
      classItems={CLASS_ITEMS}
      memberItems={MEMBER_ITEMS}
      patternItems={PATTERN_ITEMS}
      showPatterns
      onReset={() => setState(emptyGalleryFilterPanelState())}
    />
  )
}

export const Empty: Story = { render: () => <Demo initial={emptyGalleryFilterPanelState()} /> }
export const Active: Story = {
  render: () => {
    const initial = emptyGalleryFilterPanelState()
    initial.uploadFrom = '2024-12-01'
    initial.uploadTo = '2024-12-31'
    initial.labeled = 'labeled'
    initial.archive = 'unarchived'
    initial.hasComments = true
    initial.selectedClassIds = new Set(['cl-1', 'cl-3'])
    initial.selectedMemberIds = new Set(['mb-1'])
    initial.selectedPatternIds = new Set(['pt-A'])
    return <Demo initial={initial} />
  },
}
