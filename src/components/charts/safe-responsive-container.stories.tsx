import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import { SafeResponsiveContainer } from './safe-responsive-container'
import { ChartTooltipContent } from './chart-tooltip'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Charts/SafeResponsiveContainer',
  component: SafeResponsiveContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof SafeResponsiveContainer>

export default meta

type Story = StoryObj<typeof meta>

const sample = [
  { day: 'Mon', value: 320 },
  { day: 'Tue', value: 410 },
  { day: 'Wed', value: 280 },
  { day: 'Thu', value: 520 },
  { day: 'Fri', value: 460 },
]

export const Review: Story = {
  args: { children: <div /> },
  render: () => (
    <StorybookPage
      title="SafeResponsiveContainer"
      description="recharts ResponsiveContainer의 안정 대체. ResizeObserver + window resize로 자식에게 width/height을 주입한다. grid + min-height:0 등에서 size 0 보고 버그를 회피한다."
    >
      <StorybookSection title="Sizing" description="다양한 컨테이너 크기에서 차트가 자동으로 맞춰진다.">
        <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
          <StorybookCard title="240×180" subtitle="작은 컨테이너">
            <div style={{ width: 240, height: 180 }}>
              <SafeResponsiveContainer>
                <BarChart data={sample}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--ig-color-border-subtle)" />
                  <XAxis dataKey="day" stroke="var(--ig-color-text-muted)" />
                  <YAxis stroke="var(--ig-color-text-muted)" />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--ig-color-accent)" />
                </BarChart>
              </SafeResponsiveContainer>
            </div>
          </StorybookCard>
          <StorybookCard title="full × 240" subtitle="가로 신축">
            <div style={{ width: '100%', height: 240 }}>
              <SafeResponsiveContainer>
                <BarChart data={sample}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--ig-color-border-subtle)" />
                  <XAxis dataKey="day" stroke="var(--ig-color-text-muted)" />
                  <YAxis stroke="var(--ig-color-text-muted)" />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--ig-color-accent)" />
                </BarChart>
              </SafeResponsiveContainer>
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
