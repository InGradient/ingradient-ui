import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { SettingsRow } from './settings-row'
import { Switch, Checkbox } from '../../components/inputs/toggles'
import { SettingsGeneralTab } from '../../../packages/platform-pages/src/settings-modal/general/settings-general-tab'

describe('SettingsRow control naming', () => {
  it('names a Switch without nested labels and associates its description', () => {
    const change = vi.fn()
    const { container } = render(<SettingsRow label="Alert sound" description="After capture" control={<Switch checked onChange={change} />} />)
    expect(container.querySelector('label label')).toBeNull()
    expect(screen.getByRole('checkbox', { name: 'Alert sound' })).toHaveAccessibleDescription('After capture')
    fireEvent.click(screen.getByText('Alert sound'))
    expect(change).toHaveBeenCalledOnce()
  })
  it('preserves explicit input IDs and native label activation', () => {
    render(<SettingsRow label="Preview" control={<Checkbox id="preview" checked onChange={() => {}} />} />)
    expect(screen.getByRole('checkbox', { name: 'Preview' })).toHaveAttribute('id', 'preview')
  })
  it('keeps Platform checkbox names and independent activation', () => {
    const change = vi.fn()
    const { container } = render(<SettingsGeneralTab locale="en" onChangeLocale={() => {}} enableHoverPreview singleClickToEdit showLabelsOnThumbnails onChangeEnableHoverPreview={change} onChangeSingleClickToEdit={() => {}} onChangeShowLabelsOnThumbnails={() => {}} />)
    expect(container.querySelector('label label')).toBeNull()
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
    fireEvent.click(screen.getByText('Enable hover preview in data grids'))
    expect(change).toHaveBeenCalledExactlyOnceWith(false)
  })
})
