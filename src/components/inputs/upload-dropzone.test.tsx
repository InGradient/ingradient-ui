import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { UploadDropzone } from './upload-dropzone'

describe('UploadDropzone', () => {
  it('renders default text', () => {
    render(<UploadDropzone onFiles={() => {}} />)
    expect(screen.getByText('Drop files here or click to browse')).toBeInTheDocument()
  })

  it('renders custom children', () => {
    render(<UploadDropzone onFiles={() => {}}><span>Upload</span></UploadDropzone>)
    expect(screen.getByText('Upload')).toBeInTheDocument()
  })

  it('calls onFiles on drop', () => {
    const onFiles = vi.fn()
    render(<UploadDropzone onFiles={onFiles} />)
    const area = screen.getByText('Drop files here or click to browse')
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })
    fireEvent.drop(area, { dataTransfer: { files: [file] } })
    expect(onFiles).toHaveBeenCalledWith([file])
  })

  it('does not call onFiles when disabled', () => {
    const onFiles = vi.fn()
    render(<UploadDropzone onFiles={onFiles} disabled />)
    const area = screen.getByText('Drop files here or click to browse')
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })
    fireEvent.drop(area, { dataTransfer: { files: [file] } })
    expect(onFiles).not.toHaveBeenCalled()
  })
})
