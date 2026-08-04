import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LoginView } from './LoginView'
import { SignupView } from './SignupView'

function loginProps() {
  return {
    email: '',
    password: '',
    keepSignedIn: false,
    rememberPassword: false,
    onEmailChange: vi.fn(),
    onPasswordChange: vi.fn(),
    onKeepSignedInChange: vi.fn(),
    onRememberPasswordChange: vi.fn(),
    onSubmit: vi.fn(),
    onNavigateSignup: vi.fn(),
  }
}

function signupProps() {
  return {
    email: '',
    name: '',
    organization: '',
    password: '',
    onEmailChange: vi.fn(),
    onNameChange: vi.fn(),
    onOrganizationChange: vi.fn(),
    onPasswordChange: vi.fn(),
    onSubmit: vi.fn(),
    onNavigateLogin: vi.fn(),
  }
}

describe('Platform Auth views', () => {
  it('reports controlled Login fields, preferences, submit, and navigation', () => {
    const props = loginProps()
    render(<LoginView {...props} />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'operator@ingradient.ai' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secure-passphrase' } })
    fireEvent.click(screen.getByRole('checkbox', { name: 'Keep me signed in' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Remember password' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    fireEvent.click(screen.getByRole('link', { name: 'Sign up' }))

    expect(props.onEmailChange).toHaveBeenCalledWith('operator@ingradient.ai')
    expect(props.onPasswordChange).toHaveBeenCalledWith('secure-passphrase')
    expect(props.onKeepSignedInChange).toHaveBeenCalledWith(true)
    expect(props.onRememberPasswordChange).toHaveBeenCalledWith(true)
    expect(props.onSubmit).toHaveBeenCalledOnce()
    expect(props.onNavigateSignup).toHaveBeenCalledOnce()
  })

  it('disables every Login form control while submitting', () => {
    render(<LoginView {...loginProps()} submitting />)

    expect(screen.getByLabelText('Email')).toBeDisabled()
    expect(screen.getByLabelText('Password')).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: 'Keep me signed in' })).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: 'Remember password' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Signing in…' })).toBeDisabled()
  })

  it('connects simultaneous Login warning and error messages without duplicate IDs', () => {
    render(
      <LoginView
        {...loginProps()}
        warning="Single sign-on is temporarily unavailable."
        error="Invalid email or password."
        credentialsInvalid
      />,
    )

    const email = screen.getByLabelText('Email')
    const warning = screen.getByText('Single sign-on is temporarily unavailable.')
    const error = screen.getByText('Invalid email or password.')
    expect(warning.id).not.toBe(error.id)
    expect(email).toHaveAttribute('aria-describedby', `${warning.id} ${error.id}`)
  })

  it('reports controlled Signup fields, submit, and navigation', () => {
    const props = signupProps()
    render(<SignupView {...props} />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@ingradient.ai' } })
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Operator' } })
    fireEvent.change(screen.getByLabelText('Organization'), { target: { value: 'Ingradient' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secure-passphrase' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }))
    fireEvent.click(screen.getByRole('link', { name: 'Sign in' }))

    expect(props.onEmailChange).toHaveBeenCalledWith('new@ingradient.ai')
    expect(props.onNameChange).toHaveBeenCalledWith('New Operator')
    expect(props.onOrganizationChange).toHaveBeenCalledWith('Ingradient')
    expect(props.onPasswordChange).toHaveBeenCalledWith('secure-passphrase')
    expect(props.onSubmit).toHaveBeenCalledOnce()
    expect(props.onNavigateLogin).toHaveBeenCalledOnce()
  })

  it('connects the Signup password error to the invalid field', () => {
    render(
      <SignupView
        {...signupProps()}
        error="Password does not meet requirements (min 8 chars)."
        passwordInvalid
      />,
    )

    const password = screen.getByLabelText('Password')
    const error = screen.getByText('Password does not meet requirements (min 8 chars).')
    expect(password).toHaveAttribute('aria-invalid', 'true')
    expect(password).toHaveAttribute('aria-describedby', error.id)
  })
})
