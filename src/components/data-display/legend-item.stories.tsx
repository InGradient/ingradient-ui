import type { Meta, StoryObj } from '@storybook/react-vite'
import { LegendItem } from './legend-item'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/LegendItem',
  component: LegendItem,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof LegendItem>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { color: '#3b82f6', label: 'Legend' },
  render: () => (
    <StorybookPage
      title="LegendItem"
      description="색상 swatch(sm) + 라벨로 구성된 정적 범례 항목. 차트·맵 등의 색상 범례 줄에 사용."
    >
      <StorybookSection title="상태" description="기본 / 다양한 색상 / 긴 라벨.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="default" subtitle="색상 + 라벨">
            <LegendItem color="#3b82f6" label="Person" />
          </StorybookCard>
          <StorybookCard title="other color" subtitle="다른 색상">
            <LegendItem color="#22c55e" label="Vehicle" />
          </StorybookCard>
          <StorybookCard title="warm color" subtitle="다른 색상">
            <LegendItem color="#f59e0b" label="Animal" />
          </StorybookCard>
          <StorybookCard title="long label" subtitle="긴 라벨">
            <LegendItem color="#ef4444" label="Background / unlabeled region" />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
