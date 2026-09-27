import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CameraSettingsDialogView } from './CameraSettingsDialogView'
import { TabsList } from '../../../platform-pages/src/settings-modal/SettingsModalView.styles'

const labels = { title: 'Settings', close: 'Close', tabGeneral: 'General', tabConnection: 'Connection', tabCamera: 'Camera', tabLighting: 'Lighting', tabServer: 'Server', tabData: 'Data', tabLogs: 'Logs', tabExperiments: 'Experiments', tabFieldTest: 'Field Test', tabAbout: 'About' }

describe('CameraSettingsDialogView visible tabs', () => {
  it('adds Capture between Camera and Lighting only when its label is supplied', () => {
    const setTab = vi.fn()
    const { rerender } = render(<CameraSettingsDialogView labels={labels} activeTab="general" currentUserRole="owner"
      onSetActiveTab={setTab} onClose={() => {}} generalContent={<p>General</p>} />)
    expect(screen.queryByRole('tab', { name: 'Capture' })).not.toBeInTheDocument()
    rerender(<CameraSettingsDialogView labels={{ ...labels, tabCapture: 'Capture' }} activeTab="capture" currentUserRole="owner"
      onSetActiveTab={setTab} onClose={() => {}} captureContent={<p>Capture settings</p>} />)
    expect(screen.getAllByRole('tab').map(tab => tab.textContent).slice(2, 5)).toEqual(['Camera', 'Capture', 'Lighting'])
    expect(screen.getByRole('tab', { name: 'Capture' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Capture settings')).toBeVisible()
  })
  it('uses the identical generic settings item appearance as Platform without hiding tab content', () => {
    render(<><TabsList items={[{ value: 'general', label: 'Platform General' }]} value="general" onChange={() => {}} />
      <CameraSettingsDialogView labels={labels} activeTab="general" currentUserRole="owner" onSetActiveTab={() => {}} onClose={() => {}} generalContent={<p>General controls</p>} /></>)
    const platform = screen.getByRole('tab', { name: 'Platform General' })
    const edge = screen.getByRole('tab', { name: 'General' })
    expect(platform.className).toBe(edge.className)
    for (const tab of [platform, edge]) {
      expect(tab.closest('[role="tablist"]')).toHaveAttribute('data-appearance', 'settings')
      expect(tab.closest('[role="tablist"]')?.querySelector(':scope > [aria-hidden]')).toBeNull()
    }
    expect(screen.getByRole('tabpanel', { name: 'General' })).toHaveTextContent('General controls')
  })
  it.each(['viewer', null])('normalizes hidden camera content for %s', (role) => {
    const change = vi.fn()
    render(<CameraSettingsDialogView labels={labels} activeTab="camera" currentUserRole={role} onSetActiveTab={change} onClose={() => {}} generalContent={<p>General controls</p>} cameraContent={<p>Restricted controls</p>} />)
    expect(screen.queryByRole('tab', { name: 'Camera' })).not.toBeInTheDocument()
    expect(screen.queryByText('Restricted controls')).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'General', selected: true })).toBeInTheDocument()
    expect(change).toHaveBeenCalledWith('general')
    const panel = screen.getByRole('tabpanel', { name: 'General' })
    expect(screen.getByRole('tab', { name: 'General' })).toHaveAttribute('aria-controls', panel.id)
  })
  it.each(['owner', 'manager'])('preserves all tabs and active content for %s', (role) => {
    const change = vi.fn()
    render(<CameraSettingsDialogView labels={labels} activeTab="camera" currentUserRole={role} onSetActiveTab={change} onClose={() => {}} cameraContent={<p>Camera controls</p>} />)
    expect(screen.getAllByRole('tab')).toHaveLength(10)
    expect(screen.getByRole('tabpanel', { name: 'Camera' })).toHaveTextContent('Camera controls')
    expect(change).not.toHaveBeenCalled()
  })
})
