import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsHint } from './settings-hint'

const meta: Meta<typeof SettingsHint> = {
  title: 'Patterns/Shells/SettingsHint',
  component: SettingsHint,
  decorators: [(Story) => <div style={{ width: 480, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'These preferences are local to this browser and only affect how the portal UI behaves for your account.' },
}

export const ShortHint: Story = {
  args: { children: 'Saving automatically.' },
}
