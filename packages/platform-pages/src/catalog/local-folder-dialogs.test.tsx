import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RegisterFolderDialog } from './register-folder-dialog'
import { YoloFolderExportDialog } from './yolo-folder-export-dialog'

const noop = () => undefined

describe('RegisterFolderDialog', () => {
  it('submits trimmed values only when both fields are filled', () => {
    const onSubmit = vi.fn()
    render(<RegisterFolderDialog open phase="form" onClose={noop} onSubmit={onSubmit} />)
    const register = screen.getByRole('button', { name: 'Register' })
    expect(register).toBeDisabled()
    fireEvent.change(screen.getByLabelText('Dataset name'), { target: { value: ' Batch 1 ' } })
    expect(register).toBeDisabled()
    fireEvent.change(screen.getByLabelText('Folder path'), { target: { value: ' /data/batch-1 ' } })
    fireEvent.click(register)
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Batch 1', folderPath: '/data/batch-1' })
  })

  it('shows the server error on the form when the job failed', () => {
    render(<RegisterFolderDialog open phase="failed" error="Folder not found." onClose={noop} onSubmit={noop} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Folder not found.')
    expect(screen.getByLabelText('Folder path')).toBeInTheDocument()
  })

  it('hides empty mismatch rows in the completed report', () => {
    const report = { images: 3, boxes: 7, per_class: [{ name: 'scratch', boxes: 7 }], missing_labels: [], orphan_labels: ['a.txt'] }
    render(<RegisterFolderDialog open phase="completed" report={report} onClose={noop} onSubmit={noop} />)
    expect(screen.queryByText('Images without labels')).not.toBeInTheDocument()
    expect(screen.getByText('Labels without images')).toBeInTheDocument()
  })
})

describe('YoloFolderExportDialog', () => {
  it('requires a class name only when merging into one class', () => {
    const onSubmit = vi.fn()
    render(<YoloFolderExportDialog open phase="form" datasetName="Batch 1" onClose={noop} onSubmit={onSubmit} />)
    const exportButton = screen.getByRole('button', { name: 'Export' })
    expect(exportButton).toBeDisabled()
    fireEvent.change(screen.getByLabelText('Output folder'), { target: { value: '/data/out' } })
    expect(exportButton).toBeEnabled()
    fireEvent.click(screen.getByText(/Merge into one class/))
    expect(exportButton).toBeDisabled()
    fireEvent.change(screen.getByLabelText('Class name'), { target: { value: 'defect' } })
    fireEvent.click(exportButton)
    expect(onSubmit).toHaveBeenCalledWith({ outputDir: '/data/out', classMode: 'single', singleClassName: 'defect' })
  })

  it('shows the written folder instead of a download when completed', () => {
    render(
      <YoloFolderExportDialog
        open phase="completed" datasetName="Batch 1" outputDir="/data/out" carriedEntries={['notes.json']}
        onClose={noop} onSubmit={noop}
      />,
    )
    expect(screen.getByText('/data/out')).toBeInTheDocument()
    expect(screen.getByText(/notes\.json/)).toBeInTheDocument()
  })
})
