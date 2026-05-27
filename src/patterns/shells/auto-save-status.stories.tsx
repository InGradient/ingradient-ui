import type { Meta, StoryObj } from '@storybook/react-vite'
import { AutoSaveStatus } from './auto-save-status'

const meta: Meta<typeof AutoSaveStatus> = {
  title: 'Patterns/AutoSaveStatus',
  component: AutoSaveStatus,
  decorators: [(Story) => <div style={{ width: 480, padding: 16, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Idle: Story = { args: { state: 'idle' } }
export const Pending: Story = { args: { state: 'pending' } }
export const Saving: Story = { args: { state: 'saving' } }
export const Saved: Story = { args: { state: 'saved' } }
export const ErrorState: Story = { args: { state: 'error', errorMessage: 'Failed to save: network timeout.' } }
export const ErrorFallback: Story = { args: { state: 'error' } }
export const ReadOnly: Story = { args: { state: 'idle', readOnly: true } }
export const Invalid: Story = { args: { state: 'idle', invalid: true, invalidMessage: 'Project name cannot be empty.' } }
