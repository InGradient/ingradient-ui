import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './card'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/DataDisplay/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

const BODY_STYLE = { fontSize: 'var(--ig-font-size-sm)', color: 'var(--ig-color-text-secondary)' }

export const Review: Story = {
  args: { children: 'Card' },
  render: () => (
    <StorybookPage
      title="Card"
      description="surface 카드 컨테이너. elevation(panel/card/raised) + flat(그림자 제거) + border(strong) + tone(danger) 조합으로 표면을 제어. 페이지의 inline 카드표면은 이 컴포넌트로 수렴한다."
    >
      <StorybookSection title="Elevation" description="surface + 그림자 단계.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="panel" subtitle="기본 (surface-panel)">
            <Card elevation="panel"><span style={BODY_STYLE}>panel surface</span></Card>
          </StorybookCard>
          <StorybookCard title="card" subtitle="surface-card 그라데이션">
            <Card elevation="card"><span style={BODY_STYLE}>card surface</span></Card>
          </StorybookCard>
          <StorybookCard title="raised" subtitle="surface-raised + floating shadow">
            <Card elevation="raised"><span style={BODY_STYLE}>raised surface</span></Card>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="flat / border / tone" description="그림자 제거·테두리 강조·danger 톤.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="flat" subtitle="box-shadow 제거">
            <Card elevation="raised" flat><span style={BODY_STYLE}>flat raised</span></Card>
          </StorybookCard>
          <StorybookCard title="border=strong" subtitle="border-strong 테두리">
            <Card elevation="raised" flat border="strong"><span style={BODY_STYLE}>strong border</span></Card>
          </StorybookCard>
          <StorybookCard title="tone=danger" subtitle="alert-danger bg/border">
            <Card elevation="raised" flat tone="danger"><span style={BODY_STYLE}>danger card</span></Card>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="radius / padding" description="prop 으로 토큰 지정.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="radius=xs, padding=4" subtitle="조밀">
            <Card elevation="raised" flat radius="var(--ig-radius-xs)" padding="var(--ig-space-4)"><span style={BODY_STYLE}>compact</span></Card>
          </StorybookCard>
          <StorybookCard title="radius=lg, padding=9" subtitle="여유">
            <Card elevation="raised" flat radius="var(--ig-radius-lg)" padding="var(--ig-space-9)"><span style={BODY_STYLE}>spacious</span></Card>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
