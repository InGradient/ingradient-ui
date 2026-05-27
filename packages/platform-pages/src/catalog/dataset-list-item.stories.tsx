import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatasetListItem } from './dataset-list-item'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Platform Pages/Catalog/DatasetListItem',
  component: DatasetListItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof DatasetListItem>

export default meta

type Story = StoryObj<typeof meta>

function InteractiveRow(props: { id: string; name: string; taskType: 'object_detection' | 'classification' | 'segmentation' | 'point' }) {
  const [selected, setSelected] = useState(false)
  const [current, setCurrent] = useState(false)
  return (
    <div style={{ width: 320 }}>
      <DatasetListItem
        id={props.id}
        name={props.name}
        taskType={props.taskType}
        selected={selected}
        current={current}
        onToggleSelect={(_, checked) => setSelected(checked)}
        onSelectCurrent={() => setCurrent((v) => !v)}
        onOpenMenu={() => undefined}
      />
    </div>
  )
}

export const Review: Story = {
  args: { id: 'd1', name: 'Wafer line A', taskType: 'object_detection' },
  render: () => (
    <StorybookPage
      title="DatasetListItem"
      description="dataset browsing 맥락의 row composition: checkbox + name + task tag + kebab menu. SelectableListItem 위에 도메인 슬롯을 채운 wrapper pattern이다."
    >
      <StorybookSection title="Task types" description="DatasetTaskTag tone에 따른 시각 구분.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Object detection">
            <InteractiveRow id="d1" name="Wafer line A — production batch 2024Q4" taskType="object_detection" />
          </StorybookCard>
          <StorybookCard title="Classification">
            <InteractiveRow id="d2" name="Surface defects" taskType="classification" />
          </StorybookCard>
          <StorybookCard title="Segmentation">
            <InteractiveRow id="d3" name="Pixel segmentation" taskType="segmentation" />
          </StorybookCard>
          <StorybookCard title="Point / keypoint">
            <InteractiveRow id="d4" name="Keypoint dataset" taskType="point" />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="States" description="selected / current / dragOver 상태.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Selected (checkbox on)">
            <div style={{ width: 320 }}>
              <DatasetListItem id="d1" name="Wafer line A" taskType="object_detection" selected />
            </div>
          </StorybookCard>
          <StorybookCard title="Current (active row)">
            <div style={{ width: 320 }}>
              <DatasetListItem id="d1" name="Wafer line A" taskType="object_detection" current />
            </div>
          </StorybookCard>
          <StorybookCard title="Drag over (drop target)">
            <div style={{ width: 320 }}>
              <DatasetListItem id="d1" name="Wafer line A" taskType="object_detection" dragOver />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
