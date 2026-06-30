import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectableGridCell } from './selectable-grid-cell'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/SelectableGridCell',
  component: SelectableGridCell,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof SelectableGridCell>

export default meta

type Story = StoryObj<typeof meta>

const THUMB_STYLE = {
  height: 'var(--ig-popup-2xs)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--ig-color-surface-muted)',
  color: 'var(--ig-color-text-soft)',
  fontSize: 'var(--ig-font-size-xs)',
}

export const Review: Story = {
  args: { selected: false, ariaLabel: 'Grid item', children: 'Cell' },
  render: () => (
    <StorybookPage
      title="SelectableGridCell"
      description="선택 가능한 이미지/카드 그리드 셀. role=button + aria-pressed 로 선택 상태 전달, Enter/Space 키 지원. selected 시 강조 테두리·링 표시. 썸네일 그리드에 사용."
    >
      <StorybookSection title="상태" description="기본 / 선택됨 / draggable.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="default" subtitle="비선택">
            <SelectableGridCell selected={false} ariaLabel="Select image 'a.jpg'" onClick={() => {}}>
              <div style={THUMB_STYLE}>a.jpg</div>
            </SelectableGridCell>
          </StorybookCard>
          <StorybookCard title="selected" subtitle="강조 테두리 + 링">
            <SelectableGridCell selected ariaLabel="Select image 'b.jpg'" onClick={() => {}}>
              <div style={THUMB_STYLE}>b.jpg</div>
            </SelectableGridCell>
          </StorybookCard>
          <StorybookCard title="draggable" subtitle="드래그 가능">
            <SelectableGridCell selected={false} draggable ariaLabel="Select image 'c.jpg'" onClick={() => {}}>
              <div style={THUMB_STYLE}>c.jpg</div>
            </SelectableGridCell>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
