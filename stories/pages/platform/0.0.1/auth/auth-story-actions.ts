import { fn } from 'storybook/test'

export interface LoginSubmission {
  email: string
  password: string
  keepSignedIn: boolean
  rememberPassword: boolean
}

export interface LoginStoryActions {
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onKeepSignedInChange: (checked: boolean) => void
  onRememberPasswordChange: (checked: boolean) => void
  onSubmit: (submission: LoginSubmission) => void
  onNavigateSignup: () => void
}

export interface SignupSubmission {
  email: string
  name: string
  organization: string
  password: string
}

export interface SignupStoryActions {
  onEmailChange: (value: string) => void
  onNameChange: (value: string) => void
  onOrganizationChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (submission: SignupSubmission) => void
  onNavigateLogin: () => void
}

export function createLoginActionArgs(): LoginStoryActions {
  return {
    onEmailChange: fn<(value: string) => void>(),
    onPasswordChange: fn<(value: string) => void>(),
    onKeepSignedInChange: fn<(checked: boolean) => void>(),
    onRememberPasswordChange: fn<(checked: boolean) => void>(),
    onSubmit: fn<(submission: LoginSubmission) => void>(),
    onNavigateSignup: fn<() => void>(),
  }
}

export function createSignupActionArgs(): SignupStoryActions {
  return {
    onEmailChange: fn<(value: string) => void>(),
    onNameChange: fn<(value: string) => void>(),
    onOrganizationChange: fn<(value: string) => void>(),
    onPasswordChange: fn<(value: string) => void>(),
    onSubmit: fn<(submission: SignupSubmission) => void>(),
    onNavigateLogin: fn<() => void>(),
  }
}
