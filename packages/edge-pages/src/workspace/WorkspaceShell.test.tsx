import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WorkspaceShell } from './WorkspaceShell'
import type { WorkspaceViewProps } from './types'
const WORKSPACE_LABELS = { saving: 'Saving', sequenceFailed: 'Mock sequence failed', errorCode: 'Error', cancel: 'Cancel', retry: 'Retry' }
const WORKSPACE_TABS: WorkspaceViewProps['tabItems'] = [{ value: 'capture', label: 'Capture' }, { value: 'images', label: 'Images' }]

function props(overrides: Partial<WorkspaceViewProps> = {}): WorkspaceViewProps {
  return {
    mode: 'main', selectedDatasetId: 'mock-dataset', activeTab: 'capture', tabItems: WORKSPACE_TABS,
    onTabChange: vi.fn(), isSetupMode: false, setupPanelTarget: null, setupPanelContent: null,
    captureContent: <button>Capture content</button>, imagesContent: null, staticsContent: null,
    sequenceFailure: null, isCapturing: false, capturingStatusText: 'Mock capture busy',
    labels: WORKSPACE_LABELS, onSequenceFailureCancel: vi.fn(), onSequenceFailureRetry: vi.fn(),
    isSavingLabel: false, ...overrides,
  }
}

describe('WorkspaceShell capture safety', () => {
  it('makes navigation/content inert and guards synthetic changes while busy', () => {
    const onTabChange = vi.fn()
    const { rerender } = render(<WorkspaceShell {...props({ isCapturing: true, onTabChange })} />)
    const images = screen.getByRole('tab', { name: 'Images' })
    expect(images.closest('[inert]')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Capture content' }).closest('[inert]')).not.toBeNull()
    fireEvent.click(images)
    expect(onTabChange).not.toHaveBeenCalled()
    expect(screen.getByRole('status')).toHaveTextContent('Mock capture busy')
    rerender(<WorkspaceShell {...props({ onTabChange })} />)
    expect(images.closest('[inert]')).toBeNull()
    fireEvent.click(images)
    expect(onTabChange).toHaveBeenCalledWith('images')
  })

  it('keeps failure Cancel, Escape, and retry outside the busy subtree', () => {
    const onSequenceFailureCancel = vi.fn()
    const onSequenceFailureRetry = vi.fn()
    render(<WorkspaceShell {...props({
      isCapturing: true, sequenceFailure: { message: 'Mock failure', errorCode: 'MOCK' },
      onSequenceFailureCancel, onSequenceFailureRetry,
    })} />)
    const cancel = screen.getByRole('button', { name: WORKSPACE_LABELS.cancel })
    expect(cancel.closest('[inert]')).toBeNull()
    fireEvent.click(cancel)
    expect(onSequenceFailureCancel).toHaveBeenCalledOnce()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onSequenceFailureCancel).toHaveBeenCalledTimes(2)
    fireEvent.click(screen.getByRole('button', { name: /Retry/i }))
    expect(onSequenceFailureRetry).toHaveBeenCalledOnce()
  })
})
