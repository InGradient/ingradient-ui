import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsRow } from './settings-row'
import { Checkbox, Switch } from '../../components/inputs/toggles'
import { useState } from 'react'
import { expect } from 'storybook/test'

const meta: Meta<typeof SettingsRow> = {
  title: 'Patterns/Forms/SettingsRow',
  component: SettingsRow,
  decorators: [(Story) => <div style={{ width: 480, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const NamedSwitch: Story = {
  parameters: { a11y: { test: 'error' } },
  render: () => {
    const [enabled, setEnabled] = useState(false)
    return <SettingsRow label="Alert sound" description="Play after capture" control={<Switch checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />} />
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(canvasElement.querySelector('label label')).toBeNull()
    const input = canvas.getByRole('checkbox', { name: 'Alert sound' })
    await expect(input).toHaveAccessibleDescription('Play after capture')
    await userEvent.click(canvas.getByText('Alert sound'))
    await expect(input).toBeChecked()
    input.focus()
    await userEvent.keyboard(' ')
    await expect(input).not.toBeChecked()
  },
}

export const Default: Story = {
  args: {
    label: 'Enable hover preview',
    control: <Checkbox checked onChange={() => undefined} />,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Show labels on thumbnails',
    control: <Checkbox checked={false} onChange={() => undefined} />,
  },
}

export const AsDivRow: Story = {
  args: {
    asLabel: false,
    label: 'Interface language',
    control: <div style={{ padding: 'var(--ig-space-1) var(--ig-space-3)', background: 'var(--ig-color-surface-raised)', borderRadius: 6, fontSize: 13 }}>English ▾</div>,
  },
}
