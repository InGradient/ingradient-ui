import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { AddDatasetModalView } from './AddDatasetModalView'
import { ExportModalView } from './ExportModalView'
import { CreateProjectFormView } from './CreateProjectFormView'
import type { ExportModalViewProps } from './types'

const exportProps: ExportModalViewProps = {
  datasetName: 'Synthetic', imageCount: 12, localImageCount: 8, phase: 'running', error: null,
  labels: { title: 'Export', cancel: 'Cancel', close: 'Close', export: 'Export', exporting: 'Exporting images', complete: 'Done', images: String, localImages: String },
  onClose: vi.fn(), onExport: vi.fn(),
}

function AddDatasetFocusHarness() {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  return <>
    <button onClick={() => { setBusy(false); setOpen(true) }}>Open dataset form</button>
    {open && <AddDatasetModalView name="Fixture" taskType="object_detection" selectedClassIds={new Set()} allClasses={[]} namePlaceholder="Name"
      adding={busy} error={null} labels={{ title: 'Add dataset', cancel: 'Cancel', add: 'Add', adding: 'Adding', datasetNameLabel: 'Dataset name', taskTypeLabel: 'Task', classesLabel: () => 'Classes', taskTypeOptions: { classification: 'Classification', object_detection: 'Detection', segmentation: 'Segmentation', point: 'Point' } }}
      onNameChange={vi.fn()} onTaskTypeChange={vi.fn()} onClassesChange={vi.fn()}
      onSubmit={(event) => { event.preventDefault(); setBusy(true) }} onClose={() => setOpen(false)} />}
  </>
}

describe('dataset modal contracts', () => {
  it.each(['cancel', 'escape', 'backdrop'])('focuses the name after capturing the opener and restores it on busy %s', (method) => {
    render(<AddDatasetFocusHarness />)
    const opener = screen.getByRole('button', { name: 'Open dataset form' })
    opener.focus()
    fireEvent.click(opener)
    const input = screen.getByLabelText('Dataset name')
    expect(input).toHaveFocus()
    fireEvent.submit(input.closest('form')!)
    expect(input).toBeDisabled()
    if (method === 'cancel') fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    else if (method === 'escape') fireEvent.keyDown(window, { key: 'Escape' })
    else fireEvent.click(screen.getByRole('dialog').parentElement!)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })
  it('preserves legacy noncancellable exports and permits explicit running cancellation', () => {
    const close = vi.fn(); const cancel = vi.fn()
    const { rerender } = render(<ExportModalView {...exportProps} onClose={close} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(close).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    rerender(<ExportModalView {...exportProps} onClose={close} onCancel={cancel} />)
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(cancel).toHaveBeenCalledOnce()
    expect(close).not.toHaveBeenCalled()
  })
  it('names the progress and announces completion', () => {
    render(<ExportModalView {...exportProps} phase="done" />)
    expect(screen.getByRole('progressbar', { name: 'Exporting images' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Done')
  })
  it('connects the dataset field and error and blocks repeat submission while busy', () => {
    const submit = vi.fn((event) => event.preventDefault())
    render(<AddDatasetModalView name="" taskType="object_detection" selectedClassIds={new Set()} allClasses={[]} namePlaceholder="Name"
      adding error="Enter a name" labels={{ title: 'Add dataset', cancel: 'Cancel', add: 'Add', adding: 'Adding', datasetNameLabel: 'Dataset name', taskTypeLabel: 'Task', classesLabel: () => 'Classes', taskTypeOptions: { classification: 'Classification', object_detection: 'Detection', segmentation: 'Segmentation', point: 'Point' } }}
      onNameChange={vi.fn()} onTaskTypeChange={vi.fn()} onClassesChange={vi.fn()} onSubmit={submit} onClose={vi.fn()} />)
    const input = screen.getByLabelText('Dataset name')
    expect(input).toBeDisabled()
    expect(input).toHaveAccessibleDescription('Enter a name')
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a name')
    fireEvent.submit(input.closest('form')!)
    expect(submit).not.toHaveBeenCalled()
  })
  it('keeps the legacy create-project informational path and exposes an opt-in named form', () => {
    const labels = { emptyOnline: 'No projects', createOnPlatform: 'Create on platform' }
    const { rerender } = render(<CreateProjectFormView labels={labels} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    rerender(<CreateProjectFormView labels={labels} form={{ open: true, name: 'Fixture', busy: false, error: null, title: 'Create project', nameLabel: 'Project name', submitLabel: 'Create', cancelLabel: 'Cancel', onOpen: vi.fn(), onClose: vi.fn(), onNameChange: vi.fn(), onSubmit: vi.fn() }} />)
    expect(screen.getByRole('dialog', { name: 'Create project' })).toBeInTheDocument()
    expect(screen.getByLabelText('Project name')).toHaveValue('Fixture')
  })
})
