import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsRow } from './settings-row'
import { Checkbox } from '../../components/inputs/toggles'

const meta: Meta<typeof SettingsRow> = {
  title: 'Patterns/Shells/SettingsRow',
  component: SettingsRow,
  decorators: [(Story) => <div style={{ width: 480, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

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
    control: <div style={{ padding: '4px 8px', background: 'var(--ig-color-surface-raised)', borderRadius: 6, fontSize: 13 }}>English ▾</div>,
  },
}
