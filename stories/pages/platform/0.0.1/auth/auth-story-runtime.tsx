import { useEffect, useState } from 'react'
import { LoginView, SignupView } from '@ingradient/platform-pages'
import type {
  PlatformLoginScenario,
  PlatformSignupScenario,
} from '../../../../fixtures/platform/0.0.1'
import { getFixtures } from '../../../../support/fixtures-registry'
import type { LoginStoryActions, SignupStoryActions } from './auth-story-actions'

const fixtures = getFixtures('platform', '0.0.1')

export interface LoginStoryArgs extends LoginStoryActions {
  scenario: PlatformLoginScenario
}

export interface SignupStoryArgs extends SignupStoryActions {
  scenario: PlatformSignupScenario
}

export function LoginStoryScene({ scenario: key, ...actions }: LoginStoryArgs) {
  const scenario = fixtures.auth.login[key]
  const [email, setEmail] = useState(scenario.user?.email ?? '')
  const [password, setPassword] = useState(scenario.password ?? '')
  const [keepSignedIn, setKeepSignedIn] = useState(scenario.keepSignedIn ?? false)
  const [rememberPassword, setRememberPassword] = useState(scenario.rememberPassword ?? false)
  const [error, setError] = useState<string | null>(scenario.error ?? null)

  useEffect(() => {
    setEmail(scenario.user?.email ?? '')
    setPassword(scenario.password ?? '')
    setKeepSignedIn(scenario.keepSignedIn ?? false)
    setRememberPassword(scenario.rememberPassword ?? false)
    setError(scenario.error ?? null)
  }, [scenario])

  const clearCredentialError = () => {
    if (key === 'validation-error') setError(null)
  }

  return (
    <LoginView
      email={email}
      password={password}
      keepSignedIn={keepSignedIn}
      rememberPassword={rememberPassword}
      submitting={scenario.loading}
      warning={scenario.warning}
      error={error}
      credentialsInvalid={key === 'validation-error' && !!error}
      onEmailChange={(value) => {
        actions.onEmailChange(value)
        setEmail(value)
        clearCredentialError()
      }}
      onPasswordChange={(value) => {
        actions.onPasswordChange(value)
        setPassword(value)
        clearCredentialError()
      }}
      onKeepSignedInChange={(checked) => {
        actions.onKeepSignedInChange(checked)
        setKeepSignedIn(checked)
      }}
      onRememberPasswordChange={(checked) => {
        actions.onRememberPasswordChange(checked)
        setRememberPassword(checked)
      }}
      onSubmit={() => actions.onSubmit({ email, password, keepSignedIn, rememberPassword })}
      onNavigateSignup={actions.onNavigateSignup}
    />
  )
}

export function SignupStoryScene({ scenario: key, ...actions }: SignupStoryArgs) {
  const scenario = fixtures.auth.signup[key]
  const [email, setEmail] = useState(scenario.email)
  const [name, setName] = useState(scenario.name)
  const [organization, setOrganization] = useState(scenario.organization)
  const [password, setPassword] = useState(scenario.password)
  const [error, setError] = useState<string | null>(scenario.error ?? null)

  useEffect(() => {
    setEmail(scenario.email)
    setName(scenario.name)
    setOrganization(scenario.organization)
    setPassword(scenario.password)
    setError(scenario.error ?? null)
  }, [scenario])

  return (
    <SignupView
      email={email}
      name={name}
      organization={organization}
      password={password}
      submitting={scenario.loading}
      error={error}
      passwordInvalid={key === 'password-requirements' && !!error}
      onEmailChange={(value) => {
        actions.onEmailChange(value)
        setEmail(value)
      }}
      onNameChange={(value) => {
        actions.onNameChange(value)
        setName(value)
      }}
      onOrganizationChange={(value) => {
        actions.onOrganizationChange(value)
        setOrganization(value)
      }}
      onPasswordChange={(value) => {
        actions.onPasswordChange(value)
        setPassword(value)
        if (key === 'password-requirements') setError(null)
      }}
      onSubmit={() => actions.onSubmit({ email, name, organization, password })}
      onNavigateLogin={actions.onNavigateLogin}
    />
  )
}
