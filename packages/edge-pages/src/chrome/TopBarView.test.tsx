import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { TopBarView } from './TopBarView'
import { AutoInspectView } from './AutoInspectView'

const LABELS = { refresh: 'Refresh', settingsTitle: 'Settings', settingsDisabledTitle: 'Settings unavailable' }
const base = {
  selectedProjectName: 'FINEMTECH', selectedDatasetName: '26.09.02', connectionStatus: 'disconnected' as const,
  connectionTitle: 'Camera disconnected', isRefreshing: false, canSetupCamera: true, labels: LABELS,
  onBackToDatasets: () => undefined, onRefresh: () => undefined, onOpenSettings: () => undefined,
}

describe('TopBarView status icons', () => {
  it('camera icon carries its status as name and opens connection settings', () => {
    const onOpenConnectionSettings = vi.fn()
    render(<TopBarView {...base} onOpenConnectionSettings={onOpenConnectionSettings} />)
    const camera = screen.getByRole('button', { name: 'Camera disconnected' })
    expect(camera).toHaveAttribute('data-status-tone', 'danger')
    fireEvent.click(camera)
    expect(onOpenConnectionSettings).toHaveBeenCalledOnce()
  })
  it('shows the PLC icon only when PLC status is given, grey without an address', () => {
    const onOpen = vi.fn()
    const { rerender } = render(<TopBarView {...base} />)
    expect(screen.queryByRole('button', { name: /PLC/ })).not.toBeInTheDocument()
    rerender(<TopBarView {...base} plcStatus={{ tone: 'unconfigured', title: 'No PLC address', onOpen }} />)
    const plc = screen.getByRole('button', { name: 'No PLC address' })
    expect(plc).toHaveAttribute('data-status-tone', 'neutral')
    fireEvent.click(plc)
    expect(onOpen).toHaveBeenCalledOnce()
  })
})

describe('AutoInspectView', () => {
  const labels = { start: 'Auto inspect', stop: 'Stop', starting: 'Starting…' }
  it('starts, then offers stop with the running caption', () => {
    const onStart = vi.fn(); const onStop = vi.fn()
    const { rerender } = render(<AutoInspectView running={false} labels={labels} onStart={onStart} onStop={onStop} />)
    fireEvent.click(screen.getByRole('button', { name: 'Auto inspect' }))
    expect(onStart).toHaveBeenCalledOnce()
    rerender(<AutoInspectView running caption="3 captured" labels={labels} onStart={onStart} onStop={onStop} />)
    expect(screen.getByText('3 captured')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }))
    expect(onStop).toHaveBeenCalledOnce()
  })
  it('cannot start without a dataset or while a start is pending', () => {
    const { rerender } = render(<AutoInspectView running={false} disabled labels={labels} onStart={() => undefined} onStop={() => undefined} />)
    expect(screen.getByRole('button', { name: 'Auto inspect' })).toBeDisabled()
    rerender(<AutoInspectView running={false} pending labels={labels} onStart={() => undefined} onStop={() => undefined} />)
    expect(screen.getByRole('button', { name: 'Starting…' })).toBeDisabled()
  })
})
