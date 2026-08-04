import type { MockUser } from './users'
import { mockUsers } from './users'

/** Platform 0.0.1 Login states used by the purpose-grouped Auth stories. */
export type PlatformLoginScenario =
  | 'default'
  | 'server-error'
  | 'permission-denied'
  | 'long-text'
  | 'submitting'
  | 'validation-error'

export interface PlatformLoginScene {
  user?: Pick<MockUser, 'email' | 'name'>
  password?: string
  keepSignedIn?: boolean
  rememberPassword?: boolean
  error?: string
  warning?: string
  loading?: boolean
}

export const platformLoginScenarios: Record<PlatformLoginScenario, PlatformLoginScene> = {
  default: {},
  'server-error': { user: { email: mockUsers[0].email, name: mockUsers[0].name }, password: '••••', error: 'Server error — try again later.' },
  'permission-denied': { user: { email: mockUsers[0].email, name: mockUsers[0].name }, error: 'Account suspended. Contact administrator.' },
  'long-text': {
    user: { email: 'a-very-long-email-address-for-overflow-testing@incredibly-long-domain.example.com', name: 'Long Name For Overflow Testing' },
    password: '••••••••••••••••',
  },
  submitting: { user: { email: mockUsers[0].email, name: mockUsers[0].name }, password: '••••••••', keepSignedIn: true, loading: true },
  'validation-error': { user: { email: mockUsers[0].email, name: mockUsers[0].name }, password: '••••', error: 'Invalid email or password.' },
}

export type PlatformSignupScenario = 'default' | 'password-requirements' | 'submitting'

export interface PlatformSignupScene {
  email: string
  name: string
  organization: string
  password: string
  error?: string
  loading?: boolean
}

export const platformSignupScenarios: Record<PlatformSignupScenario, PlatformSignupScene> = {
  default: { email: '', name: '', organization: '', password: '' },
  'password-requirements': {
    email: 'newuser@acme.io',
    name: mockUsers[1].name,
    organization: mockUsers[1].organization,
    password: '••••••',
    error: 'Password does not meet requirements (min 8 chars).',
  },
  submitting: {
    email: 'newuser@acme.io',
    name: mockUsers[1].name,
    organization: mockUsers[1].organization,
    password: '••••••••',
    loading: true,
  },
}
