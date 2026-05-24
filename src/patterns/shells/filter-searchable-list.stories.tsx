import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FilterSearchableList, type FilterSearchableItem } from './filter-searchable-list'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/FilterSearchableList',
  component: FilterSearchableList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof FilterSearchableList>

export default meta

type Story = StoryObj<typeof meta>

const CLASSES: FilterSearchableItem[] = [
  { id: 'defect', label: 'Defect', color: '#ef4444' },
  { id: 'crack', label: 'Crack', color: '#f97316' },
  { id: 'stain', label: 'Stain', color: '#eab308' },
  { id: 'scratch', label: 'Scratch', color: '#22c55e' },
  { id: 'dent', label: 'Dent', color: '#3b82f6' },
  { id: 'rust', label: 'Rust', color: '#a855f7' },
  { id: 'edge', label: 'Edge anomaly', color: '#06b6d4' },
  { id: 'particle', label: 'Particle', color: '#ec4899' },
]

function InteractiveList({
  items,
  initial,
  placeholder,
}: {
  items: FilterSearchableItem[]
  initial?: Set<string>
  placeholder?: string
}) {
  const [selected, setSelected] = useState(initial ?? new Set<string>())
  return (
    <div style={{ width: 260 }}>
      <FilterSearchableList
        items={items}
        selectedIds={selected}
        placeholder={placeholder}
        onToggle={(id, checked) => {
          setSelected((prev) => {
            const next = new Set(prev)
            if (checked) next.add(id)
            else next.delete(id)
            return next
          })
        }}
      />
    </div>
  )
}

export const Review: Story = {
  args: { items: CLASSES, selectedIds: new Set(), onToggle: () => undefined },
  render: () => (
    <StorybookPage
      title="FilterSearchableList"
      description="SearchField + FilterClassChip 리스트 composition. 검색어로 필터링되고, 결과 없을 땐 empty 메시지 표시."
    >
      <StorybookSection title="Variants" description="기본 / 사전 선택 / empty 상태.">
        <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
          <StorybookCard title="Default" subtitle="아무것도 선택되지 않음">
            <InteractiveList items={CLASSES} />
          </StorybookCard>
          <StorybookCard title="Pre-selected" subtitle="3개 사전 선택">
            <InteractiveList items={CLASSES} initial={new Set(['defect', 'stain', 'rust'])} />
          </StorybookCard>
          <StorybookCard title="Custom placeholder">
            <InteractiveList items={CLASSES} placeholder="Filter classes…" />
          </StorybookCard>
          <StorybookCard title="Empty items" subtitle="emptyMessage 노출">
            <InteractiveList items={[]} />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
