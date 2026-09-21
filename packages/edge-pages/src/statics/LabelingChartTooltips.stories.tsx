import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { AvgSizeTooltip, TrendTooltip } from './LabelingChartTooltips'

const meta = {
  title: 'Edge Pages/Statics/LabelingChartTooltips', component: TrendTooltip,
  parameters: { a11y: { test: 'error' }, docs: { description: { component: 'Domain tooltip adapters retain positive-only trend counts and one-decimal pixel formatting. Average size uses ChartTooltipContent. Trend uses its TooltipCard/KeyValueRow building blocks because ChartTooltipContent currently ignores payload colors; class swatches must remain visible.' } } },
} satisfies Meta<typeof TrendTooltip>
export default meta
type Story = StoryObj<typeof meta>

export const Trend: Story = {
  args: { active: true, label: '2026-09-20', payload: [
    { dataKey: 'defect', name: 'Defect', value: 12, color: 'var(--ig-color-accent)' },
    { dataKey: 'scratch', name: 'Scratch', value: 3, color: 'var(--ig-color-warning)' },
    { dataKey: 'zero', name: 'No annotations', value: 0 },
  ] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Defect')).toBeVisible()
    await expect(canvas.getByText('12')).toBeVisible()
    await expect(canvas.queryByText('No annotations')).not.toBeInTheDocument()
  },
}
export const AverageSize: Story = {
  args: { active: true, label: 'Defect', payload: [{ dataKey: 'avg_w', value: 12.345 }, { dataKey: 'avg_h', value: 0 }] },
  render: (args) => <AvgSizeTooltip {...args} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Width')).toBeVisible()
    await expect(canvas.getByText('12.3px')).toBeVisible()
    await expect(canvas.getByText('Height')).toBeVisible()
    await expect(canvas.getByText('0.0px')).toBeVisible()
  },
}
export const Empty: Story = {
  args: { active: true, label: 'No data', payload: [] },
  play: async ({ canvas }) => { await expect(canvas.queryByText('No data')).not.toBeInTheDocument() },
}
