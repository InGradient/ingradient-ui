export interface LoginViewProps {
  email: string
  password: string
  keepSignedIn: boolean
  rememberPassword: boolean
  submitting?: boolean
  warning?: string | null
  error?: string | null
  credentialsInvalid?: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onKeepSignedInChange: (checked: boolean) => void
  onRememberPasswordChange: (checked: boolean) => void
  onSubmit: () => void
  onNavigateSignup: () => void
}

export interface SignupViewProps {
  email: string
  name: string
  organization: string
  password: string
  submitting?: boolean
  error?: string | null
  passwordInvalid?: boolean
  onEmailChange: (value: string) => void
  onNameChange: (value: string) => void
  onOrganizationChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: () => void
  onNavigateLogin: () => void
}
