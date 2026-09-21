import { it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ScanSectionView } from './ScanSectionView'
import { CONNECTION_LABELS } from '../../../../../stories/fixtures/edge/0.0.5/connection'
import type { GigEDevice } from '../types'

it('keeps Force IP independent of camera selection', () => {
  const device: GigEDevice = { type: 'gige', ip: '192.168.0.2', mac: '00:11:22:33:44:55', manufacturer: 'Example', model: 'Camera', reachable: false }
  const select = vi.fn()
  const force = vi.fn()
  const { container } = render(<ScanSectionView isScanning={false} discoveredDevices={[device]} nicCandidates={null} isLoadingCandidates={false} selectedCamera={null} selectedNic={null} labels={CONNECTION_LABELS} onScan={vi.fn()} onSelectCamera={select} onSelectNic={vi.fn()} onRequestForceIp={force} />)
  expect(container.querySelector('button button')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Force IP' }))
  expect(force).toHaveBeenCalledExactlyOnceWith(device)
  expect(select).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: /Example Camera/, pressed: false }))
  expect(select).toHaveBeenCalledExactlyOnceWith(device)
})
