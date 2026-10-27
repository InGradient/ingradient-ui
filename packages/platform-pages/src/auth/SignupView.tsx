import { useId, type FormEvent, type MouseEvent } from 'react'
import { Alert, Button, FormField, PasswordField, TextField } from '@ingradient/ui/components'
import { AuthLink, Form, SubmitRow } from './AuthView.styles'
import { AuthPageShell } from './auth-page-shell'
import type { SignupViewProps } from './types'
import { SurfaceDepthProvider } from '@ingradient/ui/primitives'

function SignupViewContent({
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
  const emailId = useId()
  const nameId = useId()
  const organizationId = useId()
  const passwordId = useId()

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
        <FormField label="Email" htmlFor={emailId}>
          <TextField
            id={emailId}
            size="lg"
            type="email"
            autoComplete="email"
            placeholder="name@company.com"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            disabled={submitting}
          />
        </FormField>
        <FormField label="Name" htmlFor={nameId}>
          <TextField
            id={nameId}
            size="lg"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            disabled={submitting}
          />
        </FormField>
        <FormField label="Organization" htmlFor={organizationId}>
          <TextField
            id={organizationId}
            size="lg"
            type="text"
            autoComplete="organization"
            value={organization}
            onChange={(event) => onOrganizationChange(event.target.value)}
            disabled={submitting}
          />
        </FormField>
        <FormField label="Password" htmlFor={passwordId}>
          <PasswordField
            id={passwordId}
            size="lg"
            autoComplete="new-password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            disabled={submitting}
            aria-invalid={passwordInvalid || undefined}
            aria-describedby={error ? messageId : undefined}
          />
        </FormField>
        <SubmitRow>
          <Button type="submit" variant="accent" size="lg" disabled={submitting}>
            {submitting ? 'Signing up…' : 'Sign up'}
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
export function SignupView(props: SignupViewProps) {
  return (
    <SurfaceDepthProvider>
      <SignupViewContent {...props} />
    </SurfaceDepthProvider>
  )
}
