import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { act, render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LogPanelView } from './LogPanelView'
import type { LogPanelViewProps } from './types'

function baseProps(overrides: Partial<LogPanelViewProps> = {}): LogPanelViewProps {
  return {
    entries: [], hasMore: false, showFilterPopover: true,
    datePreset: 'all', dateFrom: '', dateTo: '',
    showProgress: false, showConnections: false, showDebug: false,
    hoveredLogIndex: null, displayedLogIndex: null, hoveredLog: null,
    displayImageUrl: null, modalImageUrl: null,
    labels: {
      title: 'Activity log', filterButton: 'Filter', filterByDate: 'Date',
      filterLogType: 'Log type', filterProgress: 'Progress',
      filterConnections: 'Connections', filterDebug: 'Debug',
      dateAll: 'All dates', dateToday: 'Today', dateLast7: 'Last 7 days',
      dateLast30: 'Last 30 days', dateCustom: 'Custom', dateFrom: 'From', dateTo: 'To',
      noActivity: 'No activity', hoverHint: 'Hover for details', openSavedImage: 'Open saved image',
    },
    onToggleFilterPopover: vi.fn(), onCloseFilterPopover: vi.fn(),
    onSetDatePreset: vi.fn(), onSetDateFrom: vi.fn(), onSetDateTo: vi.fn(),
    onSetShowProgress: vi.fn(), onSetShowConnections: vi.fn(), onSetShowDebug: vi.fn(),
    onSetHoveredLogIndex: vi.fn(), onSetPanelHovered: vi.fn(), onScrollNearBottom: vi.fn(),
    onOpenImageModal: vi.fn(), onCloseImageModal: vi.fn(), onOpenSavedImage: vi.fn(),
    ...overrides,
  }
}

describe('LogPanelView accessibility', () => {
  it('names each filter without nested labels and preserves text-click activation', () => {
    const props = baseProps()
    const { container } = render(<LogPanelView {...props} />)
    expect(container.querySelector('label label')).toBeNull()
    for (const [name, callback] of [
      ['Progress', props.onSetShowProgress],
      ['Connections', props.onSetShowConnections],
      ['Debug', props.onSetShowDebug],
    ] as const) {
      expect(screen.getByRole('checkbox', { name })).toBeInTheDocument()
      fireEvent.click(screen.getByText(name))
      expect(callback).toHaveBeenCalledWith(true)
    }
  })

  it('keeps filter names unique across multiple panels and supports Space', async () => {
    const user = userEvent.setup()
    const first = baseProps()
    const second = baseProps()
    render(<><LogPanelView {...first} /><LogPanelView {...second} /></>)
    const controls = screen.getAllByRole('checkbox', { name: 'Debug' })
    expect(controls[0].id).not.toBe(controls[1].id)
    controls[1].focus()
    await user.keyboard(' ')
    expect(second.onSetShowDebug).toHaveBeenCalledWith(true)
    expect(first.onSetShowDebug).not.toHaveBeenCalled()
  })

  it('places the named scrolling region in keyboard order', async () => {
    const user = userEvent.setup()
    render(<LogPanelView {...baseProps({ showFilterPopover: false })} />)
    screen.getByRole('button', { name: 'Filter' }).focus()
    await user.tab()
    expect(screen.getByRole('region', { name: 'Activity log' })).toHaveFocus()
  })

  it('supports keyboard row navigation and keeps detail alive when entering its controls', async () => {
    const user = userEvent.setup()
    const logs = [{ msg: 'First capture', detail: 'Details', type: 'success' as const }, { msg: 'Second capture', type: 'info' as const }]
    function Controlled() {
      const [index, setIndex] = React.useState<number | null>(null)
      return <LogPanelView {...baseProps({ showFilterPopover: false, entries: logs.map((log, i) => ({ log, index: i })), hoveredLogIndex: index, hoveredLog: index === null ? null : logs[index], onSetHoveredLogIndex: setIndex, displayImageUrl: 'data:image/svg+xml,sample' })} />
    }
    render(<Controlled />)
    act(() => screen.getByRole('button', { name: /First capture/ }).focus())
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', { name: /Second capture/ })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('region', { name: 'Activity log detail' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Close log detail' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('region', { name: 'Activity log detail' })).not.toBeInTheDocument()
  })

  it('uses the shared dialog for log image Escape and focus restoration', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [url, setUrl] = React.useState<string | null>(null)
      return <LogPanelView {...baseProps({ hoveredLog: { msg: 'Sample' }, displayImageUrl: 'sample.svg', modalImageUrl: url, onOpenImageModal: setUrl, onCloseImageModal: () => setUrl(null) })} />
    }
    render(<Controlled />)
    const trigger = screen.getByRole('button', { name: 'Enlarge capture image' })
    await user.click(trigger)
    expect(screen.getByRole('dialog', { name: 'Capture enlarged' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('retains the near-bottom pagination callback', () => {
    const props = baseProps({ hasMore: true })
    render(<LogPanelView {...props} />)
    fireEvent.scroll(screen.getByRole('region', { name: 'Activity log' }))
    expect(props.onScrollNearBottom).toHaveBeenCalledOnce()
  })
})
