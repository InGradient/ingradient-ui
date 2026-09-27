import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LogPanelCollapsedView } from './LogPanelCollapsedView'

describe('LogPanelCollapsedView', () => {
  it('keeps expand and status actions keyboard-reachable', () => {
    const select = vi.fn()
    const expand = vi.fn()
    render(<LogPanelCollapsedView
      entries={[{ index: 0, log: { msg: 'Capture saved', type: 'success' } }]}
      hoveredLogIndex={null} labels={{ expandPanel: 'Expand panel' }}
      onSetHoveredLogIndex={select} onExpand={expand} />)
    expect(screen.getByRole('button', { name: 'Expand panel' }).closest('[data-ig-collapsed-panel]')).toHaveAttribute('data-ig-collapsed-panel', 'left')
    fireEvent.focus(screen.getByRole('button', { name: 'Capture saved' }))
    expect(select).toHaveBeenCalledWith(0)
    fireEvent.click(screen.getByRole('button', { name: 'Expand panel' }))
    expect(expand).toHaveBeenCalledOnce()
  })
})
