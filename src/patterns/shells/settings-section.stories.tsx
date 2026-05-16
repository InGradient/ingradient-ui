import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsSection } from './settings-section'

const meta: Meta<typeof SettingsSection> = {
  title: 'Patterns/Shells/SettingsSection',
  component: SettingsSection,
  decorators: [(Story) => <div style={{ width: 480, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const WithTitle: Story = {
  args: { title: 'Language', children: <span style={{ color: 'var(--ig-color-text-primary)' }}>Section content here</span> },
}

export const NoTitle: Story = {
  args: { children: <span style={{ color: 'var(--ig-color-text-primary)' }}>Section without title</span> },
}
