import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DraggableAnalysisWidgetGrid } from './DraggableAnalysisWidgetGrid'

const widgets = {
  first: <div>First widget</div>,
  second: <div>Second widget</div>,
}

const baseProps = {
  layout: [['first', 'second']],
  widgets,
  widgetKeys: ['first', 'second'] as const,
  widgetTitles: { first: 'First widget', second: 'Second widget' },
  onDownloadWidget: vi.fn(),
  emptyState: <div>No visible widgets</div>,
}

describe('DraggableAnalysisWidgetGrid', () => {
  it('moves from visible widgets to the empty state without changing hook order', () => {
    const { rerender } = render(<DraggableAnalysisWidgetGrid {...baseProps} />)
    expect(screen.getAllByRole('button', { name: /Drag .* widget/ })).toHaveLength(2)

    rerender(
      <DraggableAnalysisWidgetGrid
        {...baseProps}
        visibility={{ first: false, second: false }}
      />,
    )

    expect(screen.getByText('No visible widgets')).toBeInTheDocument()
  })

  it('keeps drag and download controls as sibling buttons', () => {
    render(<DraggableAnalysisWidgetGrid {...baseProps} />)
    const dragHandle = screen.getByRole('button', { name: 'Drag First widget' })
    const download = screen.getAllByRole('button', { name: 'Download widget image' })[0]

    expect(dragHandle.contains(download)).toBe(false)
    expect(download.contains(dragHandle)).toBe(false)
  })

  it('reorders the controlled layout with the drag handle arrow keys', () => {
    const onLayoutChange = vi.fn()
    render(
      <DraggableAnalysisWidgetGrid
        {...baseProps}
        layout={[['first'], ['second']]}
        onLayoutChange={onLayoutChange}
      />,
    )

    const dragHandle = screen.getByRole('button', { name: 'Drag First widget' })
    expect(dragHandle).toHaveAttribute(
      'aria-keyshortcuts',
      'ArrowLeft ArrowRight ArrowUp ArrowDown',
    )
    fireEvent.keyDown(dragHandle, { key: 'ArrowDown' })

    expect(onLayoutChange).toHaveBeenCalledWith([['second', 'first']])
    expect(screen.getByText('Moved First widget down.')).toBeInTheDocument()
  })
})
