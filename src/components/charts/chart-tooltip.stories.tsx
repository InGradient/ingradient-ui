import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChartTooltipContent } from './chart-tooltip'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Charts/ChartTooltip',
  component: ChartTooltipContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ChartTooltipContent>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { active: true, payload: [] },
  render: () => (
    <StorybookPage
      title="ChartTooltipContent"
      description="recharts Tooltip slot용 컨텐츠. 차트 카드 내부에서 <Tooltip content={<ChartTooltipContent />} /> 형태로 주입된다."
    >
      <StorybookSection title="Variants" description="active state와 payload 조합별 표시.">
        <StorybookGrid columns="repeat(auto-fit, minmax(220px, 1fr))">
          <StorybookCard title="Single series" subtitle="label + 1 row">
            <ChartTooltipContent
              active
              label="2026-05-01"
              payload={[{ name: 'Labeled', value: 128, color: 'var(--ig-color-accent)' }]}
            />
          </StorybookCard>
          <StorybookCard title="Multi series" subtitle="label + multiple rows">
            <ChartTooltipContent
              active
              label="2026-05-01"
              payload={[
                { name: 'Labeled', value: 128, color: 'var(--ig-color-success)' },
                { name: 'Pending', value: 47, color: 'var(--ig-color-warning)' },
                { name: 'Failed', value: 9, color: 'var(--ig-color-danger)' },
              ]}
            />
          </StorybookCard>
          <StorybookCard title="No label" subtitle="payload만">
            <ChartTooltipContent
              active
              payload={[
                { name: 'Defect', value: 42, color: '#ef4444' },
                { name: 'Crack', value: 28, color: '#f97316' },
              ]}
            />
          </StorybookCard>
          <StorybookCard title="Inactive" subtitle="active=false → null 반환">
            <ChartTooltipContent
              active={false}
              label="hidden"
              payload={[{ name: 'Hidden', value: 0 }]}
            />
          </StorybookCard>
          <StorybookCard title="Empty payload" subtitle="payload=[] → null 반환">
            <ChartTooltipContent active label="empty" payload={[]} />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
