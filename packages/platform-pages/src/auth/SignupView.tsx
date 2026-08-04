import { useId, type FormEvent, type MouseEvent } from 'react'
import { Alert, Button, PasswordField, TextField } from '@ingradient/ui/components'
import { AuthLink, Form } from './AuthView.styles'
import { AuthPageShell } from './auth-page-shell'
import type { SignupViewProps } from './types'

export function SignupView({
  email,
  name,
  organization,
  password,
  submitting = false,
  error,
  passwordInvalid = false,
  onEmailChange,
  onNameChange,
  onOrganizationChange,
  onPasswordChange,
  onSubmit,
  onNavigateLogin,
}: SignupViewProps) {
  const messageId = useId()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit()
  }

  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onNavigateLogin()
  }

  return (
    <AuthPageShell
      page="signup"
      title="Sign up"
      footer={<>Already have an account? <AuthLink href="/login" onClick={handleNavigate}>Sign in</AuthLink></>}
    >
      <Form onSubmit={handleSubmit} aria-busy={submitting}>
        {error ? <Alert id={messageId} $tone="danger">{error}</Alert> : null}
        <TextField
          type="email"
          aria-label="Email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          disabled={submitting}
        />
        <TextField
          type="text"
          aria-label="Name"
          autoComplete="name"
          placeholder="Name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          disabled={submitting}
        />
        <TextField
          type="text"
          aria-label="Organization"
          autoComplete="organization"
          placeholder="Organization"
          value={organization}
          onChange={(event) => onOrganizationChange(event.target.value)}
          disabled={submitting}
        />
        <PasswordField
          aria-label="Password"
          autoComplete="new-password"
          placeholder="Password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          disabled={submitting}
          aria-invalid={passwordInvalid || undefined}
          aria-describedby={error ? messageId : undefined}
        />
        <Button type="submit" variant="accent" disabled={submitting}>
          {submitting ? 'Signing up…' : 'Sign up'}
        </Button>
      </Form>
    </AuthPageShell>
  )
}
