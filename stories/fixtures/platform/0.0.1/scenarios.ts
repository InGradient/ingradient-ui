import type { MockUser } from './users'
import { mockUsers } from './users'

/**
 * platform 0.0.1 auth scenarios — Login / Signup 페이지 상태 시뮬레이션 (§ 16).
 */
export type PlatformAuthScenario =
  | 'default'
  | 'error'
  | 'submitting'
  | 'validation-error'

export interface PlatformAuthScene {
  user?: Pick<MockUser, 'email' | 'name'>
  password?: string
  rememberMe?: boolean
  error?: string
  warning?: string
  loading?: boolean
}

export const platformAuthScenarios: Record<PlatformAuthScenario, PlatformAuthScene> = {
  default: {},
  error: { user: { email: mockUsers[0].email, name: mockUsers[0].name }, password: '••••', error: 'Server error — try again later.' },
  submitting: { user: { email: mockUsers[0].email, name: mockUsers[0].name }, password: '••••••••', rememberMe: true, loading: true },
  'validation-error': { user: { email: mockUsers[0].email, name: mockUsers[0].name }, password: '••••', error: 'Invalid email or password.' },
}
