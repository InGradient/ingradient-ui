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

  it('has role=button and is keyboard-focusable when enabled', () => {
    render(<UploadDropzone onFiles={() => {}} />)
    const zone = screen.getByRole('button', { name: /upload files/i })
    expect(zone).toHaveAttribute('tabindex', '0')
  })

  it('is not keyboard-focusable when disabled', () => {
    render(<UploadDropzone onFiles={() => {}} disabled />)
    const zone = screen.getByText('Drop files here or click to browse')
    expect(zone).not.toHaveAttribute('role', 'button')
    expect(zone).toHaveAttribute('tabindex', '-1')
  })

  it('triggers file input click on Enter', () => {
    render(<UploadDropzone onFiles={() => {}} />)
    const zone = screen.getByRole('button', { name: /upload files/i })
    const input = zone.querySelector('input[type="file"]') as HTMLInputElement
    const clickSpy = vi.spyOn(input, 'click')
    fireEvent.keyDown(zone, { key: 'Enter' })
    expect(clickSpy).toHaveBeenCalled()
  })

  it('triggers file input click on Space', () => {
    render(<UploadDropzone onFiles={() => {}} />)
    const zone = screen.getByRole('button', { name: /upload files/i })
    const input = zone.querySelector('input[type="file"]') as HTMLInputElement
    const clickSpy = vi.spyOn(input, 'click')
    fireEvent.keyDown(zone, { key: ' ' })
    expect(clickSpy).toHaveBeenCalled()
  })

  it('does not trigger file input click on Enter when disabled', () => {
    render(<UploadDropzone onFiles={() => {}} disabled />)
    const zone = screen.getByText('Drop files here or click to browse')
    const input = zone.querySelector('input[type="file"]') as HTMLInputElement
    const clickSpy = vi.spyOn(input, 'click')
    fireEvent.keyDown(zone, { key: 'Enter' })
    expect(clickSpy).not.toHaveBeenCalled()
  })
})
