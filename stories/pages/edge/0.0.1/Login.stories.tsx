import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { LoginView, type LoginLabels, type LoginAccountEntry } from '@ingradient/edge-pages'
import { defineHandoff } from '../../../support/handoff'
import { EdgeAppFrame } from './shared/build-shell-slots'

const handoff = defineHandoff({
  service: 'edge',
  version: '0.0.1',
  page: 'Login',
  referenceStory: 'Pages / Edge / 0.0.1 / Login / Online',
  preset: 'edge-0.0.1',
  fixturesPath: 'stories/fixtures/edge/0.0.1/devices.ts',
  requiredScenarios: ['online', 'offline', 'invalid-credentials', 'submitting', 'session-continue', 'offline-package-loaded'],
  interactions: [
    'Online / Offline mode 토글',
    'Online: email + password 입력',
    'Offline: package 로드 → 인증 흐름',
    'Saved session continue 또는 다른 계정 선택',
    'Submit 중 disabled',
  ],
  platformIntegration: [
    'replace handleSubmit with Electron IPC login (edge 의 main process 와 통신)',
    'offline mode 는 keychain 의 saved credentials 사용',
    'license 가 없거나 만료 시 License 페이지로 redirect',
    'LangSelector slot — i18n 의존 컴포넌트 마운트',
    'settingsDialog slot — open 시 CameraSettingsDialog 마운트',
  ],
})

const DEFAULT_LABELS: LoginLabels = {
  title: 'INGRADIENT Edge',
  online: 'Online',
  offline: 'Offline',
  onlineSupport: 'Online support',
  loadPackage: 'Load package',
  loading: 'Loading…',
  emailLabel: 'Email',
  emailPlaceholder: 'operator@line-a.local',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Enter password',
  savePassword: 'Save password',
  keepSignedIn: 'Keep signed in',
  submit: 'Sign in',
  submitting: 'Signing in…',
  register: 'Register',
  greeting: (name) => `Hi, ${name}`,
  continueSession: 'Continue',
  changeAccount: 'Switch account',
  settingsTitle: 'Settings',
}

const LANG_SLOT = <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 12 }}>EN</span>

type SceneArgs = Parameters<typeof LoginScene>[0]

function LoginScene(args: {
  mode?: 'online' | 'offline'
  emailDefault?: string
  passwordDefault?: string
  savePasswordDefault?: boolean
  keepSignedInDefault?: boolean
  loggingIn?: boolean
  loadingPackage?: boolean
  error?: string | null
  packageInfo?: { project_name: string; package_version: number; platform_url?: string } | null
  savedSession?: { user_id: string; name: string; email: string } | null
  otherAccounts?: LoginAccountEntry[]
  hasAccountList?: boolean
  showLoginForm?: boolean
  externalUrl?: string | null
}) {
  const [email, setEmail] = useState(args.emailDefault ?? '')
  const [password, setPassword] = useState(args.passwordDefault ?? '')
  const [savePassword, setSavePassword] = useState(args.savePasswordDefault ?? true)
  const [keepSignedIn, setKeepSignedIn] = useState(args.keepSignedInDefault ?? true)

  return (
    <EdgeAppFrame
      showFooter={false}
      content={
        <LoginView
          mode={args.mode ?? 'online'}
          email={email}
          password={password}
          savePassword={savePassword}
          keepSignedIn={keepSignedIn}
          loggingIn={args.loggingIn ?? false}
          loadingPackage={args.loadingPackage ?? false}
          error={args.error ?? null}
          packageInfo={args.packageInfo ?? null}
          savedSession={args.savedSession ?? null}
          otherAccounts={args.otherAccounts ?? []}
          hasAccountList={args.hasAccountList ?? false}
          showLoginForm={args.showLoginForm ?? true}
          externalUrl={args.externalUrl ?? 'https://app.ingradient.ai'}
          labels={DEFAULT_LABELS}
          langSelector={LANG_SLOT}
          settingsDialog={null}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSavePasswordChange={setSavePassword}
          onKeepSignedInChange={setKeepSignedIn}
          onSubmit={(e) => e.preventDefault()}
          onContinueSession={() => undefined}
          onSelectAccount={() => undefined}
          onChangeAccount={() => undefined}
          onLoadPackage={() => undefined}
          onOpenSignup={() => undefined}
          onOpenSettings={() => undefined}
        />
      }
    />
  )
}

const meta = {
  title: 'Pages/Edge/0.0.1/Login',
  component: LoginScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff },
} satisfies Meta<typeof LoginScene>

export default meta

type Story = StoryObj<SceneArgs>

export const Online: Story = { args: { mode: 'online' } }

export const Offline: Story = { args: { mode: 'offline' } }

export const InvalidCredentials: Story = {
  args: { mode: 'online', emailDefault: 'operator@line-a.local', passwordDefault: '••••', error: 'Invalid credentials or device not licensed.' },
}

export const Submitting: Story = {
  args: { mode: 'online', emailDefault: 'operator@line-a.local', passwordDefault: '••••••••', loggingIn: true },
}

export const SessionContinue: Story = {
  args: {
    mode: 'online',
    hasAccountList: true,
    savedSession: { user_id: 'u1', name: 'Mina Park', email: 'mina@line-a.local' },
    otherAccounts: [
      { name: 'Joon Lee', email: 'joon@line-a.local' },
      { name: 'Sora Kim', email: 'sora@line-a.local' },
    ],
  },
}

export const OfflinePackageLoaded: Story = {
  args: {
    mode: 'offline',
    packageInfo: { project_name: 'Line A · Surface Inspection', package_version: 12, platform_url: 'https://app.ingradient.ai' },
  },
}
