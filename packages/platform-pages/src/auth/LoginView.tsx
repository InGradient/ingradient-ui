import { useId, type FormEvent, type MouseEvent } from 'react'
import { Alert, Button, Checkbox, PasswordField, TextField } from '@ingradient/ui/components'
import { AuthLink, CheckboxRow, Form, SubmitRow } from './AuthView.styles'
import { AuthPageShell } from './auth-page-shell'
import type { LoginViewProps } from './types'
import { SurfaceDepthProvider } from '@ingradient/ui/primitives'
import { FieldGroup, FieldLabel } from '@ingradient/ui/patterns'

function LoginViewContent({
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
  const emailId = useId()
  const passwordId = useId()
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
        <FieldGroup>
          <FieldLabel htmlFor={emailId}>Email</FieldLabel>
          <TextField
            id={emailId}
            size="lg"
            type="email"
            autoComplete="username"
            placeholder="name@company.com"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            disabled={submitting}
            aria-invalid={credentialsInvalid || undefined}
            aria-describedby={describedBy}
          />
        </FieldGroup>
        <FieldGroup>
          <FieldLabel htmlFor={passwordId}>Password</FieldLabel>
          <PasswordField
            id={passwordId}
            size="lg"
            autoComplete="current-password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            disabled={submitting}
            aria-invalid={credentialsInvalid || undefined}
            aria-describedby={describedBy}
          />
        </FieldGroup>
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
        <SubmitRow>
          <Button type="submit" variant="solid" size="lg" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </SubmitRow>
      </Form>
    </AuthPageShell>
  )
}

/**
 * Platform pages turn on surface depth so a rounded surface inside another rounded surface is
 * always less rounded than its parent (DESIGN.draft.md §5).
 */
export function LoginView(props: LoginViewProps) {
  return (
    <SurfaceDepthProvider>
      <LoginViewContent {...props} />
    </SurfaceDepthProvider>
  )
}
