import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsGeneralTab } from './settings-general-tab'

const meta: Meta<typeof SettingsGeneralTab> = {
  title: 'Patterns/Shells/SettingsGeneralTab',
  component: SettingsGeneralTab,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 760, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    locale: 'en', onChangeLocale: () => undefined,
    enableHoverPreview: true, onChangeEnableHoverPreview: () => undefined,
    singleClickToEdit: false, onChangeSingleClickToEdit: () => undefined,
    showLabelsOnThumbnails: true, onChangeShowLabelsOnThumbnails: () => undefined,
  },
}

export const KoreanLocale: Story = { args: { ...Default.args!, locale: 'ko' } }

export const AllOff: Story = {
  args: {
    ...Default.args!,
    enableHoverPreview: false,
    singleClickToEdit: false,
    showLabelsOnThumbnails: false,
  },
}

export const Interactive: Story = {
  render: () => {
    const [locale, setLocale] = useState('en')
    const [hover, setHover] = useState(true)
    const [single, setSingle] = useState(false)
    const [labels, setLabels] = useState(true)
    return (
      <SettingsGeneralTab
        locale={locale} onChangeLocale={setLocale}
        enableHoverPreview={hover} onChangeEnableHoverPreview={setHover}
        singleClickToEdit={single} onChangeSingleClickToEdit={setSingle}
        showLabelsOnThumbnails={labels} onChangeShowLabelsOnThumbnails={setLabels}
      />
    )
  },
}
