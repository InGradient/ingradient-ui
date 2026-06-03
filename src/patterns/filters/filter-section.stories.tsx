import type { Meta, StoryObj } from '@storybook/react-vite'
import { FilterSection } from './filter-section'
import { ColorChip } from '../../components/inputs/color-chip'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Filters/FilterSection',
  component: FilterSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof FilterSection>

export default meta

type Story = StoryObj<typeof meta>

const clearAction = (
  <button
    type="button"
    style={{
      background: 'none',
      border: 'none',
      color: 'var(--ig-color-text-muted)',
      font: 'inherit',
      fontSize: 'var(--ig-font-size-xs)',
      cursor: 'pointer',
      textDecoration: 'underline',
    }}
  >
    Clear
  </button>
)

export const Review: Story = {
  args: { title: 'Section', children: null },
  render: () => (
    <StorybookPage
      title="FilterSection"
      description="필터 panel 내부의 한 섹션 — uppercase title + 옵션 actions + content. 같은 panel 안에 여러 섹션을 쌓을 때 사용한다."
    >
      <StorybookSection title="Single" description="가장 단순한 구성.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
          <StorybookCard title="Title + content">
            <div style={{ width: 260 }}>
              <FilterSection title="Status">
                <ColorChip checked label="Pending" color="#eab308" onChange={() => undefined} />
                <ColorChip checked={false} label="Approved" color="#22c55e" onChange={() => undefined} />
                <ColorChip checked={false} label="Rejected" color="#ef4444" onChange={() => undefined} />
              </FilterSection>
            </div>
          </StorybookCard>
          <StorybookCard title="With actions slot" subtitle="우측에 Clear 등 액션">
            <div style={{ width: 260 }}>
              <FilterSection title="Class" actions={clearAction}>
                <ColorChip checked label="Defect" color="#ef4444" onChange={() => undefined} />
                <ColorChip checked label="Crack" color="#f97316" onChange={() => undefined} />
              </FilterSection>
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Stacked" description="여러 섹션이 한 panel 안에 — 사이에 border가 그어진다.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="3 sections in panel">
            <div
              style={{
                width: 280,
                padding: 'var(--ig-space-5)',
                background: 'var(--ig-color-surface-panel)',
                border: '1px solid var(--ig-color-border-subtle)',
                borderRadius: 'var(--ig-radius-md)',
              }}
            >
              <FilterSection title="Status" actions={clearAction}>
                <ColorChip checked label="Pending" onChange={() => undefined} />
                <ColorChip checked={false} label="Approved" onChange={() => undefined} />
              </FilterSection>
              <FilterSection title="Class" actions={clearAction}>
                <ColorChip checked label="Defect" color="#ef4444" onChange={() => undefined} />
                <ColorChip checked label="Crack" color="#f97316" onChange={() => undefined} />
              </FilterSection>
              <FilterSection title="Source">
                <ColorChip checked={false} label="Upload" onChange={() => undefined} />
                <ColorChip checked={false} label="Auto-label" onChange={() => undefined} />
              </FilterSection>
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
