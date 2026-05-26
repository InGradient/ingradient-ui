import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ColorChip } from './color-chip'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/ColorChip',
  component: ColorChip,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ColorChip>

export default meta

type Story = StoryObj<typeof meta>

function InteractiveChip(props: { label: string; color?: string; initial?: boolean }) {
  const [checked, setChecked] = useState(props.initial ?? false)
  return (
    <ColorChip
      checked={checked}
      label={props.label}
      color={props.color}
      onChange={setChecked}
    />
  )
}

export const Review: Story = {
  args: { checked: false, label: 'Defect', onChange: () => undefined },
  render: () => (
    <StorybookPage
      title="ColorChip"
      description="필터 panel 용 한 줄 칩 — checkbox + (optional) color swatch + label. checked 일 때 accent-soft 배경으로 active 표시."
    >
      <StorybookSection title="States" description="checked / unchecked + color swatch 유무.">
        <StorybookGrid columns="repeat(auto-fit, minmax(220px, 1fr))">
          <StorybookCard title="Unchecked, no color">
            <InteractiveChip label="All items" />
          </StorybookCard>
          <StorybookCard title="Checked, no color">
            <InteractiveChip label="All items" initial />
          </StorybookCard>
          <StorybookCard title="Unchecked, with color">
            <InteractiveChip label="Defect" color="#ef4444" />
          </StorybookCard>
          <StorybookCard title="Checked, with color">
            <InteractiveChip label="Crack" color="#f97316" initial />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Truncation" description="긴 label 은 ellipsis 처리.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Long label" subtitle="240px 폭">
            <div style={{ width: 240 }}>
              <InteractiveChip label="Long class name that should truncate gracefully" color="#22c55e" />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="List composition" description="칩들이 column 으로 쌓인 모습.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="6 items">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: 240 }}>
              <InteractiveChip label="Defect" color="#ef4444" initial />
              <InteractiveChip label="Crack" color="#f97316" />
              <InteractiveChip label="Stain" color="#eab308" initial />
              <InteractiveChip label="Scratch" color="#22c55e" />
              <InteractiveChip label="Dent" color="#3b82f6" />
              <InteractiveChip label="Rust" color="#a855f7" />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
