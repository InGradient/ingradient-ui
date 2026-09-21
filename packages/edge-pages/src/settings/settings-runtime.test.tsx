import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CameraParamsTabView } from './tabs/CameraParamsTabView'
import { ServerTabView } from './tabs/ServerTabView'
import { ForceIpDialogView } from '../connection/ForceIpDialogView'
import { CAMERA_PARAMS_TAB_LABELS, SERVER_TAB_LABELS, CONNECTION_LABELS } from '../../../../stories/fixtures/edge/0.0.5'
import { isIpv4, isSubnet, isMockServerUrl, useMaintenanceDraft } from '../../../../stories/pages/edge/0.0.5/settings/settings-drafts'

afterEach(() => { cleanup(); vi.useRealTimers() })

describe('settings synthetic contracts', () => {
  it('validates IPv4, contiguous masks and HTTP endpoints without I/O', () => {
    expect(isIpv4('192.168.1.10')).toBe(true)
    for (const value of ['1.2.3', '256.1.1.1', '1.2.3.-1', '1.2.3.1e2']) expect(isIpv4(value)).toBe(false)
    expect(isSubnet('255.255.255.0')).toBe(true)
    expect(isSubnet('255.0.255.0')).toBe(false)
    expect(isSubnet('0.0.0.0')).toBe(false)
    expect(isMockServerUrl('https://example.test')).toBe(true)
    expect(isMockServerUrl('file:///tmp/mock')).toBe(false)
  })
  it('continues field/cache/update work in the owning session and cancels field progress explicitly', () => {
    vi.useFakeTimers()
    const { result, unmount } = renderHook(useMaintenanceDraft)
    act(() => { result.current.field[1]('running'); result.current.cache[1]('running'); result.current.update[1]('checking') })
    act(() => vi.advanceTimersByTime(300))
    expect(result.current.progress[0]).toBe(25)
    act(() => result.current.field[1]('cancelled'))
    act(() => vi.advanceTimersByTime(700))
    expect(result.current.progress[0]).toBe(25)
    expect(result.current.cache[0]).toBe('done')
    expect(result.current.update[0]).toBe('available')
    act(() => result.current.update[1]('downloading'))
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
  it('cancels every pending maintenance timer when the session unmounts', () => {
    vi.useFakeTimers()
    const { result, unmount } = renderHook(useMaintenanceDraft)
    act(() => { result.current.field[1]('running'); result.current.cache[1]('running'); result.current.update[1]('checking') })
    expect(vi.getTimerCount()).toBe(3)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
    act(() => vi.advanceTimersByTime(1000))
    expect(vi.getTimerCount()).toBe(0)
  })
  it('completes a deterministic field test', () => {
    vi.useFakeTimers()
    const { result } = renderHook(useMaintenanceDraft)
    act(() => result.current.field[1]('running'))
    for (let i = 0; i < 4; i++) act(() => vi.advanceTimersByTime(300))
    expect(result.current.progress[0]).toBe(100)
    expect(result.current.field[0]).toBe('done')
  })
  it('connects visible camera and server labels to editable inputs', () => {
    const cameraChange = vi.fn()
    const serverChange = vi.fn()
    render(<><CameraParamsTabView isConnected cvsCamDllPath="camera.dll" fetching={false} saving={false} saveResult={null} labels={CAMERA_PARAMS_TAB_LABELS} onDllPathChange={cameraChange} onApplyDllPath={vi.fn()} onSave={vi.fn()} onReset={vi.fn()} />
      <ServerTabView baseUrl="https://example.test" runtimeMode="auto" saving={false} saveResult={null} saveMessage={null} connectivityResult={null} labels={SERVER_TAB_LABELS} onBaseUrlChange={serverChange} onRuntimeModeChange={vi.fn()} onSave={vi.fn()} /></>)
    fireEvent.change(screen.getByLabelText('cvsCam DLL Path'), { target: { value: 'mock.dll' } })
    fireEvent.change(screen.getByLabelText('Base URL'), { target: { value: 'https://mock.test' } })
    expect(cameraChange).toHaveBeenCalledWith('mock.dll')
    expect(serverChange).toHaveBeenCalledWith('https://mock.test')
  })
  it('names Force IP fields, announces validation and closes through Escape', () => {
    const cancel = vi.fn()
    render(<ForceIpDialogView cameraId="mock" currentIp="1.2.3.4" newIp="invalid" newSubnet="255.255.255.0" applying={false} error="Invalid address" labels={CONNECTION_LABELS} onIpChange={vi.fn()} onSubnetChange={vi.fn()} onApply={vi.fn()} onCancel={cancel} />)
    expect(screen.getByLabelText('Static IP')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Subnet mask')).toHaveValue('255.255.255.0')
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid address')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(cancel).toHaveBeenCalled()
  })
})
