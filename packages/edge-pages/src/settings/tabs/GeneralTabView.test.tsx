import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { GeneralTabView } from './GeneralTabView'

const labels = { title: 'General', captureDoneSection: 'Capture complete', captureDoneDesc: 'Notify on capture', soundLabel: 'Alert sound', soundDesc: 'Play a sound', soundPreview: 'Preview', volumeLabel: 'Volume', volumeDesc: 'Loudness', volumeSystemHint: 'System volume', messageLabel: 'Notification message', messageDesc: 'Show a message', messageTest: 'Test message', messageTestFailed: 'Failed', messageHint: 'Notification settings' }

describe('GeneralTabView accessible controls', () => {
  it('names controls and keeps selection independent from preview', () => {
    const select = vi.fn()
    const preview = vi.fn()
    const { container } = render(<GeneralTabView labels={labels} soundEnabled soundOptions={[{ id: 'chime', label: 'Chime' }]} selectedSoundId="chime" volumePercent={70} volumeLocked={false} messageEnabled testResult={null} onToggleSound={vi.fn()} onSelectSound={select} onPreviewSound={preview} onChangeVolume={vi.fn()} onPreviewVolume={vi.fn()} onToggleMessage={vi.fn()} onTestMessage={vi.fn()} />)
    expect(container.querySelector('button button, label label')).toBeNull()
    expect(screen.getByRole('checkbox', { name: 'Alert sound' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Notification message' })).toBeChecked()
    fireEvent.click(screen.getByRole('button', { name: 'Preview: Chime' }))
    expect(preview).toHaveBeenCalledExactlyOnceWith('chime')
    expect(select).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Chime', pressed: true }))
    expect(select).toHaveBeenCalledExactlyOnceWith('chime')
  })
})
