import { useId, type FormEvent, type MouseEvent } from 'react'
import { Alert, Button, Checkbox, PasswordField, TextField } from '@ingradient/ui/components'
import { AuthLink, CheckboxRow, Form } from './AuthView.styles'
import { AuthPageShell } from './auth-page-shell'
import type { LoginViewProps } from './types'

export function LoginView({
  email,
  password,
  keepSignedIn,
  rememberPassword,
  submitting = false,
  warning,
  error,
  credentialsInvalid = false,
  onEmailChange,
  onPasswordChange,
  onKeepSignedInChange,
  onRememberPasswordChange,
  onSubmit,
  onNavigateSignup,
}: LoginViewProps) {
  const warningId = useId()
  const errorId = useId()
  const describedBy = [warning ? warningId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ') || undefined

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit()
  }

  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onNavigateSignup()
  }

  return (
    <AuthPageShell
      page="login"
      title="Sign in"
      footer={<>Don&apos;t have an account? <AuthLink href="/signup" onClick={handleNavigate}>Sign up</AuthLink></>}
    >
      <Form onSubmit={handleSubmit} aria-busy={submitting}>
        {warning ? <Alert id={warningId} $tone="warning">{warning}</Alert> : null}
        {error ? <Alert id={errorId} $tone="danger">{error}</Alert> : null}
        <TextField
          type="email"
          aria-label="Email"
          autoComplete="username"
          placeholder="Email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          disabled={submitting}
          aria-invalid={credentialsInvalid || undefined}
          aria-describedby={describedBy}
        />
        <PasswordField
          aria-label="Password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          disabled={submitting}
          aria-invalid={credentialsInvalid || undefined}
          aria-describedby={describedBy}
        />
        <CheckboxRow>
          <Checkbox
            checked={keepSignedIn}
            onChange={(event) => onKeepSignedInChange(event.currentTarget.checked)}
            disabled={submitting}
            label="Keep me signed in"
          />
          <Checkbox
            checked={rememberPassword}
            onChange={(event) => onRememberPasswordChange(event.currentTarget.checked)}
            disabled={submitting}
            label="Remember password"
          />
        </CheckboxRow>
        <Button type="submit" variant="accent" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </Form>
    </AuthPageShell>
  )
}
