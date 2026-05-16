import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProjectTypeTag } from './project-type-tag'

const meta: Meta<typeof ProjectTypeTag> = {
  title: 'Patterns/Shells/ProjectTypeTag',
  component: ProjectTypeTag,
  decorators: [(Story) => <div style={{ padding: 16, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const General: Story = { args: { tone: 'general' } }
export const Deflectometry: Story = { args: { tone: 'deflectometry' } }
export const CustomLabel: Story = { args: { tone: 'deflectometry', children: 'Beta Project' } }
