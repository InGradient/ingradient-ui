import type {
  PlatformLoginScenario,
  PlatformSignupScenario,
} from '../../../../fixtures/platform/0.0.1'
import { defineHandoff } from '../../../../support/handoff'

const loginHandoff = defineHandoff({
  service: 'platform',
  version: '0.0.1',
  page: 'Auth Login',
  referenceStory: 'Pages / Platform / 0.0.1 / Auth / Login / Workspace / Overview',
  preset: 'platform-0.0.1',
  fixturesPath: 'stories/fixtures/platform/0.0.1/scenarios.ts',
  requiredScenarios: [
    'default', 'submitting', 'server-error', 'permission-denied', 'long-text',
    'validation-error',
  ],
  interactions: [
    'Invalid credentials → edit email/password → toggle preferences → submit Action',
    'Sign up link → navigation Action',
    'Submitting disables every form control',
  ],
  platformIntegration: [
    'LoginView imports from @ingradient/platform-pages',
    'onSubmit → useLogin() mutation (frontend/features/auth/use-login.ts pattern)',
    'keepSignedIn / rememberPassword → auth preference store',
  ],
})

const signupHandoff = defineHandoff({
  service: 'platform',
  version: '0.0.1',
  page: 'Auth Signup',
  referenceStory: 'Pages / Platform / 0.0.1 / Auth / Signup / Workspace / Overview',
  preset: 'platform-0.0.1',
  fixturesPath: 'stories/fixtures/platform/0.0.1/scenarios.ts',
  requiredScenarios: ['default', 'password-requirements', 'submitting'],
  interactions: [
    'Enter email/name/organization/password → submit Action',
    'Sign in link → navigation Action',
  ],
  platformIntegration: [
    'SignupView imports from @ingradient/platform-pages',
    'onSubmit → useSignup() mutation',
    'organization → user create payload or organization endpoint',
  ],
})

export const LOGIN_SCENARIO_LABELS: Record<PlatformLoginScenario, string> = {
  default: 'Empty sign-in form',
  submitting: 'Sign-in request in progress',
  'server-error': 'Server error',
  'permission-denied': 'Suspended account',
  'long-text': 'Long credential overflow',
  'validation-error': 'Invalid credentials',
}

export const SIGNUP_SCENARIO_LABELS: Record<PlatformSignupScenario, string> = {
  default: 'Empty sign-up form',
  'password-requirements': 'Password requirements error',
  submitting: 'Sign-up request in progress',
}

const ACTION_ARG_TYPE = {
  control: { disable: true },
  table: { category: 'Actions', disable: true },
} as const

function scenarioArgType<T extends string>(options: readonly T[], labels: Record<T, string>) {
  return {
    control: { type: 'select' as const, labels: Object.fromEntries(options.map((key) => [key, labels[key]])) },
    options: [...options],
    description: 'Choose a documented Auth state in this purpose group.',
    table: { category: 'Auth state' },
  }
}

export function loginArgTypes(options: readonly PlatformLoginScenario[]) {
  return {
    scenario: scenarioArgType(options, LOGIN_SCENARIO_LABELS),
    onEmailChange: ACTION_ARG_TYPE,
    onPasswordChange: ACTION_ARG_TYPE,
    onKeepSignedInChange: ACTION_ARG_TYPE,
    onRememberPasswordChange: ACTION_ARG_TYPE,
    onSubmit: ACTION_ARG_TYPE,
    onNavigateSignup: ACTION_ARG_TYPE,
  }
}

export function signupArgTypes(options: readonly PlatformSignupScenario[]) {
  return {
    scenario: scenarioArgType(options, SIGNUP_SCENARIO_LABELS),
    onEmailChange: ACTION_ARG_TYPE,
    onNameChange: ACTION_ARG_TYPE,
    onOrganizationChange: ACTION_ARG_TYPE,
    onPasswordChange: ACTION_ARG_TYPE,
    onSubmit: ACTION_ARG_TYPE,
    onNavigateLogin: ACTION_ARG_TYPE,
  }
}

export function authStoryParameters(page: 'login' | 'signup', description: string) {
  const handoff = page === 'login' ? loginHandoff : signupHandoff
  return {
    layout: 'fullscreen' as const,
    ...handoff,
    a11y: { test: 'error' as const },
    controls: { expanded: true },
    docs: {
      ...handoff.docs,
      description: { component: `${description}\n\n${handoff.docs.description.component}` },
    },
  }
}
