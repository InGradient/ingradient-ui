import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'
import { SearchableList } from './searchable-list'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/SearchableList',
  component: SearchableList,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof SearchableList>

export default meta

type Story = StoryObj<typeof meta>

interface Fruit {
  id: string
  label: string
}

const FRUITS: Fruit[] = [
  { id: '1', label: 'Apple' },
  { id: '2', label: 'Banana' },
  { id: '3', label: 'Cherry' },
  { id: '4', label: 'Grape' },
  { id: '5', label: 'Mango' },
]

const LONG_LIST: Fruit[] = Array.from({ length: 30 }, (_, i) => ({
  id: String(i + 1),
  label: `Item ${String(i + 1).padStart(2, '0')}`,
}))

const Option = styled.button`
  display: block;
  width: 100%;
  padding: var(--ig-space-2) var(--ig-space-4);
  border: none;
  background: transparent;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-sm);
  text-align: left;
  cursor: pointer;
  &:hover { background: var(--ig-color-surface-interactive); }
`

const BOX_STYLE = { minHeight: 'var(--ig-popup-list-min)' }

const renderFruit = (item: Fruit, onClick: () => void) => (
  <Option type="button" onClick={onClick}>{item.label}</Option>
)

export const Review: Story = {
  args: {
    candidates: FRUITS,
    getKey: (item) => (item as Fruit).id,
    renderItem: (item, onClick) => renderFruit(item as Fruit, onClick),
    onSelect: () => {},
  },
  render: () => (
    <StorybookPage
      title="SearchableList"
      description="검색 입력 + 필터링되는 드롭다운 목록. 입력 포커스 시 후보를 보여주고, 쿼리로 label(또는 filter prop)을 필터링한다. 결과가 없으면 emptyMessage + 선택적 emptyAction 을 노출."
    >
      <StorybookSection
        title="상태"
        description="기본(전체 후보) / 빈 결과 + 액션 / 긴 목록 스크롤. 입력에 포커스하면 드롭다운이 열린다."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="default" subtitle="전체 후보">
            <div style={BOX_STYLE}>
              <SearchableList
                candidates={FRUITS}
                getKey={(f) => f.id}
                renderItem={renderFruit}
                onSelect={() => {}}
                placeholder="Search fruit..."
              />
            </div>
          </StorybookCard>
          <StorybookCard title="empty + action" subtitle="결과 없음 + 액션">
            <div style={BOX_STYLE}>
              <SearchableList
                candidates={[]}
                getKey={(f) => f.id}
                renderItem={renderFruit}
                onSelect={() => {}}
                placeholder="Search fruit..."
                emptyMessage="No fruit found."
                emptyAction={{ label: 'Create new', onClick: () => {} }}
              />
            </div>
          </StorybookCard>
          <StorybookCard title="long list" subtitle="스크롤되는 긴 목록">
            <div style={BOX_STYLE}>
              <SearchableList
                candidates={LONG_LIST}
                getKey={(f) => f.id}
                renderItem={renderFruit}
                onSelect={() => {}}
                placeholder="Search items..."
              />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
