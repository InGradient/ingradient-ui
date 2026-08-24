import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import * as React from 'react'
import { LicenseView } from './LicenseView'
import type { LicenseViewProps, LicenseLabels } from './types'

const LABELS: LicenseLabels = {
  title: 'Test License',
  subtitle: 'Activate this device.',
  bindHint: 'Bind your device to continue.',
  hint: 'Enter the activation key.',
  fingerprintLabel: 'Device fingerprint',
  copy: 'Copy',
  copied: 'Copied!',
  keyLabel: 'License key',
  activate: 'Activate',
  activating: 'Activating…',
  bindButton: 'Bind device',
  binding: 'Binding…',
  settingsTitle: 'Settings',
}

function baseProps(overrides: Partial<LicenseViewProps> = {}): LicenseViewProps {
  return {
    mode: 'key',
    fingerprint: 'A1B2-C3D4-E5F6-7890',
    licenseKey: '',
    submitting: false,
    copied: false,
    error: null,
    labels: LABELS,
    onLicenseKeyChange: vi.fn(),
    onSubmit: vi.fn(),
    onBind: vi.fn(),
    onCopyFingerprint: vi.fn(),
    onOpenSettings: vi.fn(),
    ...overrides,
  }
}

describe('LicenseView', () => {
  it('renders title as h1', () => {
    render(<LicenseView {...baseProps()} />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toBe('Test License')
  })

  it('renders subtitle in key mode', () => {
    render(<LicenseView {...baseProps({ mode: 'key' })} />)
    expect(screen.getByText('Activate this device.')).toBeInTheDocument()
  })

  it('renders bind hint in bind mode', () => {
    render(<LicenseView {...baseProps({ mode: 'bind' })} />)
    // bindHint appears in both subtitle and hint box
    const matches = screen.getAllByText('Bind your device to continue.')
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('shows fingerprint and copy button', () => {
    render(<LicenseView {...baseProps()} />)
    expect(screen.getByText('A1B2-C3D4-E5F6-7890')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
  })

  it('calls onCopyFingerprint when copy button is clicked', () => {
    const onCopyFingerprint = vi.fn()
    render(<LicenseView {...baseProps({ onCopyFingerprint })} />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
    expect(onCopyFingerprint).toHaveBeenCalled()
  })

  it('shows copied label when copied is true', () => {
    render(<LicenseView {...baseProps({ copied: true })} />)
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument()
  })

  it('shows license key input with label in key mode', () => {
    render(<LicenseView {...baseProps({ mode: 'key' })} />)
    expect(screen.getByLabelText('License key')).toBeInTheDocument()
  })

  it('activate button is disabled when license key is empty', () => {
    render(<LicenseView {...baseProps({ licenseKey: '' })} />)
    expect(screen.getByRole('button', { name: 'Activate' })).toBeDisabled()
  })

  it('activate button is enabled when license key is filled', () => {
    render(<LicenseView {...baseProps({ licenseKey: 'ABCD-EFGH' })} />)
    expect(screen.getByRole('button', { name: 'Activate' })).toBeEnabled()
  })

  it('shows activating text when submitting', () => {
    render(<LicenseView {...baseProps({ licenseKey: 'ABCD-EFGH', submitting: true })} />)
    expect(screen.getByRole('button', { name: 'Activating…' })).toBeDisabled()
  })

  it('calls onLicenseKeyChange when key input changes', () => {
    const onLicenseKeyChange = vi.fn()
    render(<LicenseView {...baseProps({ onLicenseKeyChange })} />)
    fireEvent.change(screen.getByLabelText('License key'), { target: { value: 'NEW-KEY' } })
    expect(onLicenseKeyChange).toHaveBeenCalledWith('NEW-KEY')
  })

  it('calls onSubmit when form is submitted', () => {
    const onSubmit = vi.fn()
    render(<LicenseView {...baseProps({ licenseKey: 'ABCD-EFGH', onSubmit })} />)
    const form = screen.getByRole('button', { name: 'Activate' }).closest('form')!
    fireEvent.submit(form)
    expect(onSubmit).toHaveBeenCalled()
  })

  it('shows bind button in bind mode', () => {
    render(<LicenseView {...baseProps({ mode: 'bind' })} />)
    expect(screen.getByRole('button', { name: 'Bind device' })).toBeInTheDocument()
  })

  it('bind button shows binding text when submitting', () => {
    render(<LicenseView {...baseProps({ mode: 'bind', submitting: true })} />)
    expect(screen.getByRole('button', { name: 'Binding…' })).toBeDisabled()
  })

  it('calls onBind when bind button is clicked', () => {
    const onBind = vi.fn()
    render(<LicenseView {...baseProps({ mode: 'bind', onBind })} />)
    fireEvent.click(screen.getByRole('button', { name: 'Bind device' }))
    expect(onBind).toHaveBeenCalled()
  })

  it('shows error message when error is provided', () => {
    render(<LicenseView {...baseProps({ error: 'License key invalid' })} />)
    expect(screen.getByText('License key invalid')).toBeInTheDocument()
  })

  it('calls onOpenSettings when settings button is clicked', () => {
    const onOpenSettings = vi.fn()
    render(<LicenseView {...baseProps({ onOpenSettings })} />)
    fireEvent.click(screen.getByTitle('Settings'))
    expect(onOpenSettings).toHaveBeenCalled()
  })
})