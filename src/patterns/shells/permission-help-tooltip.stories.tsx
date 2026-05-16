import type { Meta, StoryObj } from '@storybook/react-vite'
import { PermissionHelpTooltip } from './permission-help-tooltip'

const meta: Meta<typeof PermissionHelpTooltip> = {
  title: 'Patterns/Shells/PermissionHelpTooltip',
  component: PermissionHelpTooltip,
  decorators: [(Story) => <div style={{ padding: 60, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { args: { text: 'Hover this icon to see help text.' } }

export const LongDescription: Story = {
  args: {
    text: 'Label Access — view the label list and read labels.\nLabel Edit — create, edit, and delete labels.\nReview — approve or reject labels by other reviewers.',
  },
}
