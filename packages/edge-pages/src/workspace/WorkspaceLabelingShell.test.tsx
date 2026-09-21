import * as React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WorkspaceLabelingShell } from './WorkspaceLabelingShell'

describe('WorkspaceLabelingShell busy state', () => {
  it('makes only labeling content inert while retaining announced save status', () => {
    render(<WorkspaceLabelingShell mode="labeling" isCapturing={false} capturingStatusText="" sequenceFailure={null} labels={{ saving: 'Saving labels', sequenceFailed: 'Failed', errorCode: 'Code', cancel: 'Cancel', retry: 'Retry' }} onSequenceFailureCancel={vi.fn()} onSequenceFailureRetry={vi.fn()} selectedDatasetId="simulation" activeTab="capture" tabItems={[]} onTabChange={vi.fn()} isSetupMode={false} setupPanelTarget={null} isSavingLabel labelingContent={<button>Edit labels</button>} />)
    expect(screen.getByRole('status')).toHaveTextContent('Saving labels')
    expect(screen.getByText('Edit labels').closest('[inert]')).not.toBeNull()
    expect(screen.getByRole('status').closest('[inert]')).toBeNull()
  })
})
