import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { JudgeTabView } from './JudgeTabView'
import { PlcTabView } from './PlcTabView'
import type { JudgeTabLabels, PlcSettingsValue, PlcTabLabels, PlcTabViewProps } from '../types'

const plcLabels: PlcTabLabels = {
  title: 'PLC', intro: 'Intro', needDataset: 'Open a dataset first', scope: (p, d) => `Saved to ${p} / ${d}`,
  handoverTitle: 'For the PLC engineer', handoverCopy: 'Copy', handoverCopied: 'Copied', handoverHint: 'Send these',
  lockedWhileAuto: 'Locked during auto inspection', connectionSection: 'Connection', host: 'PLC address',
  port: 'Port', portHint: 'Usually 502', unitId: 'Unit ID', unitIdHint: 'Usually 1', inputSection: 'From PLC',
  readyHint: 'Capture starts on Ready', kind: { coil: 'Coil', discrete_input: 'Discrete input' },
  outputSection: 'To PLC', outputHint: 'Coils',
  signal: { ready: 'Ready', captureDone: 'Capture done', ok: 'OK', ng: 'NG', heartbeat: 'Heartbeat', error: 'Error' },
  signalDesc: { captureDone: 'Done', ok: 'Not sent', ng: 'Not sent', heartbeat: 'Toggles', error: 'Failed' },
  duplicateWarning: (a) => `Same address: ${a}`, timingSection: 'Timing', responseTimeout: 'Timeout (s)',
  responseTimeoutHint: 'Error after this', heartbeat: 'Heartbeat (s)', heartbeatHint: 'Toggle period',
  testSection: 'Connection test', testConnect: 'Check connection', testAgentDown: 'Backend down',
  testNoAddress: 'Enter the address', testConnected: (h, p) => `Connected (${h}:${p})`,
  testDisconnected: (r) => `Disconnected — ${r}`, testReadyDesc: 'Follows the PLC', testOn: 'On', testOff: 'Off',
  testTurnOn: 'Turn on', testTurnOff: 'Turn off',
}

const settings: PlcSettingsValue = {
  host: '192.168.0.10', port: 502, unitId: 1, readyKind: 'coil', readyAddress: 0,
  outputs: { captureDone: 1, ok: 2, ng: 3, heartbeat: 4, error: 5 }, responseTimeoutS: 2.5, heartbeatS: 1,
}

function plcProps(overrides: Partial<PlcTabViewProps> = {}): PlcTabViewProps {
  return {
    dataset: { project: 'P', dataset: 'D' }, settings, locked: false, duplicateAddresses: [], handoverText: 'Modbus TCP',
    test: {
      link: { kind: 'connected', host: '192.168.0.10', port: 502 }, ready: false,
      outputs: { captureDone: false, ok: false, ng: false, heartbeat: true, error: false }, busy: false, message: null,
    },
    labels: plcLabels, onChange: vi.fn(), onChangeOutput: vi.fn(), onTestConnect: vi.fn(), onToggleOutput: vi.fn(),
    ...overrides,
  }
}

describe('PlcTabView', () => {
  it('shows only the explanation when no dataset is open', () => {
    render(<PlcTabView {...plcProps({ dataset: null })} />)
    expect(screen.getByText('Open a dataset first')).toBeVisible()
    expect(screen.queryByLabelText('PLC address')).not.toBeInTheDocument()
  })

  it('reports edits, the connection test, and signal toggles; heartbeat has no button', () => {
    const props = plcProps()
    render(<PlcTabView {...props} />)
    fireEvent.change(screen.getByLabelText('PLC address'), { target: { value: '10.0.0.5' } })
    expect(props.onChange).toHaveBeenCalledWith({ host: '10.0.0.5' })
    fireEvent.click(screen.getByRole('button', { name: 'Check connection' }))
    expect(props.onTestConnect).toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Turn on: Capture done' }))
    expect(props.onToggleOutput).toHaveBeenCalledWith('captureDone', true)
    expect(screen.queryByRole('button', { name: /Heartbeat$/ })).not.toBeInTheDocument()
    expect(screen.getByText('Connected (192.168.0.10:502)')).toBeVisible()
  })

  it('locks fields and test buttons during auto inspection and announces duplicates', () => {
    render(<PlcTabView {...plcProps({ locked: true, duplicateAddresses: [1] })} />)
    expect(screen.getByLabelText('PLC address')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Check connection' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Turn on: OK' })).toBeDisabled()
    expect(screen.getByText('Locked during auto inspection')).toHaveAttribute('role', 'status')
    expect(screen.getByRole('alert')).toHaveTextContent('Same address: 1')
  })

  it('cannot test before an address exists', () => {
    render(<PlcTabView {...plcProps({ test: { ...plcProps().test, link: { kind: 'noAddress' } } })} />)
    expect(screen.getByText('Enter the address')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Check connection' })).toBeDisabled()
  })
})

const judgeLabels: JudgeTabLabels = {
  title: 'Judge model', model: 'Model',
  state: { checking: 'Checking', unreachable: 'Unreachable', not_installed: 'Not installed', starting: 'Starting', loading: 'Preparing', ready: 'Ready', failed: 'Failed' },
  noProject: 'Choose a project', classes: 'Class links', classesHint: 'One to one', noProjectClasses: 'No classes',
  unlinked: 'Not linked', suggested: 'Picked by name', unlinkedWarn: (n) => `Not linked: ${n}`, save: 'Save',
}

describe('JudgeTabView', () => {
  const base = {
    version: 'v1', detail: null, hasProject: true, projectClasses: [{ id: 'c-ok', name: 'OK' }], classesLoading: false,
    rows: [{ modelKey: 'ok', modelName: 'ok', classId: '', suggested: false }], unlinkedNames: ['ok'],
    dirty: false, message: null, labels: judgeLabels, onChangeLink: vi.fn(), onSave: vi.fn(),
  }

  it('shows only the model state until the model is ready', () => {
    render(<JudgeTabView {...base} state="failed" detail="bad file" />)
    expect(screen.getByRole('status')).toHaveTextContent('Failed · v1 — bad file')
    expect(screen.queryByText('Class links')).not.toBeInTheDocument()
  })

  it('lists class links, warns about unlinked classes, and saves only when changed', () => {
    const { rerender } = render(<JudgeTabView {...base} state="ready" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Not linked: ok')
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    rerender(<JudgeTabView {...base} state="ready" dirty />)
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(base.onSave).toHaveBeenCalled()
  })
})
