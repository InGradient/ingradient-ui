import type { Meta, StoryObj } from '@storybook/react-vite'
import { GridContainer } from './grid-container'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/GridContainer',
  component: GridContainer,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof GridContainer>

export default meta

type Story = StoryObj<typeof meta>

const CELL_STYLE = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'var(--ig-popup-3xs)',
  background: 'var(--ig-color-surface-raised)',
  border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
  borderRadius: 'var(--ig-radius-xs)',
  color: 'var(--ig-color-text-secondary)',
  fontSize: 'var(--ig-font-size-xs)',
}

function Cells({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={CELL_STYLE}>
          {i + 1}
        </div>
      ))}
    </>
  )
}

export const Review: Story = {
  args: { children: <Cells count={4} /> },
  render: () => (
    <StorybookPage
      title="GridContainer"
      description="자식들을 반응형 그리드로 배치하는 래퍼. minWidth(셀 최소 너비, auto-fit) 또는 columns(고정 열 수) 중 하나로 열을 정하고, gap 으로 --ig-space-{n} 간격을 적용한다."
    >
      <StorybookSection title="auto-fit (minWidth)" description="columns 미지정 시 minWidth 이상에서 자동으로 열 채움.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
          <StorybookCard title="minWidth=180 (default)" subtitle="기본 셀 너비">
            <GridContainer><Cells count={5} /></GridContainer>
          </StorybookCard>
          <StorybookCard title="minWidth=120" subtitle="좁은 셀 / 더 많은 열">
            <GridContainer minWidth={120}><Cells count={6} /></GridContainer>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
      <StorybookSection title="columns (고정 열)" description="columns 지정 시 항상 해당 열 수로 등분.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
          <StorybookCard title="columns=2" subtitle="2열 고정">
            <GridContainer columns={2}><Cells count={4} /></GridContainer>
          </StorybookCard>
          <StorybookCard title="columns=3" subtitle="3열 고정">
            <GridContainer columns={3}><Cells count={6} /></GridContainer>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
      <StorybookSection title="gap" description="gap 으로 셀 간격(--ig-space 토큰) 조절.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
          <StorybookCard title="gap=2" subtitle="좁은 간격">
            <GridContainer columns={3} gap={2}><Cells count={6} /></GridContainer>
          </StorybookCard>
          <StorybookCard title="gap=8" subtitle="넓은 간격">
            <GridContainer columns={3} gap={8}><Cells count={6} /></GridContainer>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
