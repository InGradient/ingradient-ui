import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import * as React from 'react'
import { LoginView } from './LoginView'
import type { LoginViewProps, LoginLabels } from './types'

const LABELS: LoginLabels = {
  title: 'Test Login',
  online: 'Online',
  offline: 'Offline',
  onlineSupport: 'Online support',
  loadPackage: 'Load package',
  loading: 'Loading…',
  emailLabel: 'Email',
  emailPlaceholder: 'you@test.local',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Enter password',
  savePassword: 'Save password',
  keepSignedIn: 'Keep signed in',
  submit: 'Sign in',
  submitting: 'Signing in…',
  register: 'Register',
  greeting: (name) => `Hi, ${name}`,
  continueSession: 'Continue',
  changeAccount: 'Switch account',
  settingsTitle: 'Settings',
}

function baseProps(overrides: Partial<LoginViewProps> = {}): LoginViewProps {
  return {
    mode: 'online',
    email: '',
    password: '',
    savePassword: false,
    keepSignedIn: false,
    loggingIn: false,
    loadingPackage: false,
    error: null,
    packageInfo: null,
    savedSession: null,
    otherAccounts: [],
    hasAccountList: false,
    showLoginForm: true,
    externalUrl: 'https://app.test.local',
    labels: LABELS,
    onEmailChange: vi.fn(),
    onPasswordChange: vi.fn(),
    onSavePasswordChange: vi.fn(),
    onKeepSignedInChange: vi.fn(),
    onSubmit: vi.fn(),
    onContinueSession: vi.fn(),
    onSelectAccount: vi.fn(),
    onChangeAccount: vi.fn(),
    onLoadPackage: vi.fn(),
    onOpenSignup: vi.fn(),
    onOpenSettings: vi.fn(),
    ...overrides,
  }
}

describe('LoginView', () => {
  it('renders title as h1', () => {
    render(<LoginView {...baseProps()} />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toContain('Test Login')
  })

  it('shows online badge in online mode', () => {
    render(<LoginView {...baseProps({ mode: 'online' })} />)
    expect(screen.getByText('Online')).toBeInTheDocument()
  })

  it('shows offline badge and load package button in offline mode', () => {
    render(<LoginView {...baseProps({ mode: 'offline' })} />)
    expect(screen.getByText('Offline')).toBeInTheDocument()
    expect(screen.getByText('Load package')).toBeInTheDocument()
  })

  it('renders email and password fields with labels', () => {
    render(<LoginView {...baseProps()} />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('submit button is disabled when email or password is empty', () => {
    render(<LoginView {...baseProps({ email: '', password: '' })} />)
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled()
  })

  it('submit button is enabled when both email and password are filled', () => {
    render(<LoginView {...baseProps({ email: 'a@b.c', password: '123' })} />)
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled()
  })

  it('submit button shows submitting text when logging in', () => {
    render(<LoginView {...baseProps({ email: 'a@b.c', password: '123', loggingIn: true })} />)
    expect(screen.getByRole('button', { name: 'Signing in…' })).toBeDisabled()
  })

  it('calls onEmailChange when email input changes', () => {
    const onEmailChange = vi.fn()
    render(<LoginView {...baseProps({ onEmailChange })} />)
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@x.local' } })
    expect(onEmailChange).toHaveBeenCalledWith('test@x.local')
  })

  it('calls onSubmit when form is submitted', () => {
    const onSubmit = vi.fn()
    render(<LoginView {...baseProps({ email: 'a@b.c', password: '123', onSubmit })} />)
    const form = screen.getByRole('button', { name: 'Sign in' }).closest('form')!
    fireEvent.submit(form)
    expect(onSubmit).toHaveBeenCalled()
  })

  it('shows error message when error is provided', () => {
    render(<LoginView {...baseProps({ error: 'Invalid credentials' })} />)
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  it('shows saved session and continue button when hasAccountList is true', () => {
    render(<LoginView {...baseProps({
      hasAccountList: true,
      savedSession: { user_id: 'u1', name: 'Mina', email: 'mina@x.local' },
    })} />)
    expect(screen.getByText('Hi, Mina')).toBeInTheDocument()
    expect(screen.getByText('mina@x.local')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
  })

  it('shows other accounts as selectable list when hasAccountList is true', () => {
    render(<LoginView {...baseProps({
      hasAccountList: true,
      savedSession: { user_id: 'u1', name: 'Mina', email: 'mina@x.local' },
      otherAccounts: [
        { name: 'Joon', email: 'joon@x.local' },
        { name: 'Sora', email: 'sora@x.local' },
      ],
    })} />)
    expect(screen.getByText('Joon')).toBeInTheDocument()
    expect(screen.getByText('joon@x.local')).toBeInTheDocument()
    expect(screen.getByText('Sora')).toBeInTheDocument()
  })

  it('shows register link when externalUrl is provided', () => {
    render(<LoginView {...baseProps({ externalUrl: 'https://app.test.local' })} />)
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument()
  })

  it('does not show register link when externalUrl is null', () => {
    render(<LoginView {...baseProps({ externalUrl: null })} />)
    expect(screen.queryByRole('button', { name: 'Register' })).not.toBeInTheDocument()
  })

  it('calls onOpenSettings when settings button is clicked', () => {
    const onOpenSettings = vi.fn()
    render(<LoginView {...baseProps({ onOpenSettings })} />)
    fireEvent.click(screen.getByTitle('Settings'))
    expect(onOpenSettings).toHaveBeenCalled()
  })
})