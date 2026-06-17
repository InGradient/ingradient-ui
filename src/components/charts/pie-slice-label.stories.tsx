import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cell, Pie, PieChart } from 'recharts'
import { renderPieSliceLabel } from './pie-slice-label'
import { SafeResponsiveContainer } from './safe-responsive-container'
import { chartPalette } from './types'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Charts/PieSliceLabel',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const balanced = [
  { name: 'Defect', value: 320 },
  { name: 'Crack', value: 280 },
  { name: 'Stain', value: 240 },
  { name: 'Scratch', value: 160 },
]

const skewed = [
  { name: 'Major', value: 720 },
  { name: 'Minor', value: 180 },
  { name: 'Trace', value: 60 },
  { name: 'Edge', value: 18 },
  { name: 'Tiny', value: 4 },
]

function renderPie(data: typeof balanced) {
  return (
    <div style={{ width: '100%', height: 220 }}>
      <SafeResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={48}
            outerRadius={88}
            paddingAngle={3}
            label={renderPieSliceLabel}
            labelLine={false}
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={chartPalette[idx % chartPalette.length]} />
            ))}
          </Pie>
        </PieChart>
      </SafeResponsiveContainer>
    </div>
  )
}

export const Review: Story = {
  render: () => (
    <StorybookPage
      title="renderPieSliceLabel"
      description="recharts <Pie label={renderPieSliceLabel}> 호환. 슬라이스 중앙에 name + value 2줄로 라벨링. percent < 6% 슬라이스는 라벨을 생략한다."
    >
      <StorybookSection title="Variants" description="비율 분포에 따른 라벨 가시성 변화.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
          <StorybookCard title="Balanced" subtitle="모든 슬라이스 ≥ 6% → 전부 라벨링">
            {renderPie(balanced)}
          </StorybookCard>
          <StorybookCard title="Skewed" subtitle="< 6% 슬라이스(Edge/Tiny) 라벨 생략">
            {renderPie(skewed)}
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
