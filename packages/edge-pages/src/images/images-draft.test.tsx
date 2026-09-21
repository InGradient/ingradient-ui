import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { ImagesViewProps } from './types'
import { buildGroups, imagePassesDateFilter } from './image-helpers'
import { ImagesContent, useImagesDraft } from '../../../../stories/pages/edge/0.0.5/workspace/build-images-content'

vi.mock('@ingradient/edge-pages', async (importOriginal) => ({
  ...await importOriginal<typeof import('@ingradient/edge-pages')>(),
  buildGroups, imagePassesDateFilter,
  ImagesView: (props: ImagesViewProps) => <div>
    <output aria-label="Preset">{props.datePreset}</output>
    <button onClick={() => props.onSetDatePreset('today')}>Today</button>
    <button onClick={props.onSelectAll}>Select fixtures</button>
    <button onClick={props.onRequestDelete}>Request removal</button>
    {props.pendingDelete && <button onClick={props.onConfirmDelete}>Confirm removal</button>}
  </div>,
}))

function Session() {
  const draft = useImagesDraft()
  const [visible, setVisible] = useState(true)
  return <>
    <button onClick={() => setVisible((value) => !value)}>Switch tab</button>
    {visible && <ImagesContent draft={draft} />}
  </>
}

describe('session-owned image draft', () => {
  it('retains filter, selection and synthetic removals across consumer unmounts', () => {
    render(<Session />)
    fireEvent.click(screen.getByText('Today'))
    fireEvent.click(screen.getByText('Select fixtures'))
    fireEvent.click(screen.getByText('Switch tab'))
    fireEvent.click(screen.getByText('Switch tab'))
    expect(screen.getByLabelText('Preset')).toHaveTextContent('today')
    expect(screen.getByText(/Showing 4 images in 2 cells; 4 selected/)).toBeInTheDocument()
    fireEvent.click(screen.getByText('Request removal'))
    fireEvent.click(screen.getByText('Confirm removal'))
    fireEvent.click(screen.getByText('Switch tab'))
    fireEvent.click(screen.getByText('Switch tab'))
    expect(screen.getByText(/Showing 0 images in 0 cells; 0 selected/)).toBeInTheDocument()
    expect(screen.getByText(/Removed 4 synthetic fixture images/)).toBeInTheDocument()
  })

  it('keeps the omitted-draft standalone path interactive', () => {
    render(<ImagesContent />)
    fireEvent.click(screen.getByText('Select fixtures'))
    expect(screen.getByText(/12 selected/)).toBeInTheDocument()
  })
})
