import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnalysisWidgetShell } from './analysis-widget-shell'

const meta: Meta<typeof AnalysisWidgetShell> = {
  title: 'Patterns/Shells/AnalysisWidgetShell',
  component: AnalysisWidgetShell,
  decorators: [(Story) => <div style={{ width: 480, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const mockChart = (
  <div style={{
    height: 200,
    background: 'var(--ig-color-surface-raised)',
    border: '1px solid var(--ig-color-border-strong)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--ig-color-text-muted)',
  }}>
    (Mock chart content)
  </div>
)

export const NoActions: Story = { args: { children: mockChart } }
export const WithDownload: Story = { args: { children: mockChart, onDownload: () => undefined } }
