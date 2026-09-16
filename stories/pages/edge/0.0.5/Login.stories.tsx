// 화면 1 — 로그인. 현장 PC 는 인터넷이 없어 .ige 프로젝트 파일로 들어간다.
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoginView } from '@ingradient/edge-pages'
import { LOGIN_LABELS, PACKAGE_INFO, SAVED_SESSION } from '../../../fixtures/edge/0.0.5'
import { defineHandoff } from '../../../support/handoff'
import { EdgeAppFrame, LangSlot } from './shared/build-shell'

const noop = (): undefined => undefined

interface SceneArgs {
  /** offline = .ige 패키지로 들어가는 현장 기본값. */
  mode?: 'online' | 'offline'
  /** 패키지를 이미 불러왔나. */
  packageLoaded?: boolean
  /** 저장된 계정이 있나 — 있으면 폼 대신 "Welcome, …" + Continue. */
  hasSession?: boolean
  loggingIn?: boolean
  error?: string | null
}

function LoginScene(args: SceneArgs): JSX.Element {
  const {
    mode = 'offline', packageLoaded = true, hasSession = true,
    loggingIn = false, error = null,
  } = args
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [savePassword, setSavePassword] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(true)

  return (
    <EdgeAppFrame
      showFooter={false}
      content={(
        <LoginView
          mode={mode}
          email={email}
          password={password}
          savePassword={savePassword}
          keepSignedIn={keepSignedIn}
          loggingIn={loggingIn}
          loadingPackage={false}
          error={error}
          packageInfo={mode === 'offline' && packageLoaded ? PACKAGE_INFO : null}
          savedSession={hasSession ? SAVED_SESSION : null}
          otherAccounts={[]}
          hasAccountList={hasSession}
          showLoginForm={mode === 'online' || packageLoaded}
          externalUrl={mode === 'online' ? 'https://app.ingradient.ai' : null}
          labels={LOGIN_LABELS}
          langSelector={LangSlot}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSavePasswordChange={setSavePassword}
          onKeepSignedInChange={setKeepSignedIn}
          onSubmit={(e) => e.preventDefault()}
          onContinueSession={noop}
          onSelectAccount={noop}
          onChangeAccount={noop}
          onLoadPackage={noop}
          onOpenSignup={noop}
          onOpenSettings={noop}
        />
      )}
    />
  )
}

const handoff = defineHandoff({
  service: 'edge',
  version: '0.0.5',
  page: 'Login',
  referenceStory: 'Pages / Edge / 0.0.5 / Login / Offline',
  preset: 'edge-0.0.1',
  fixturesPath: 'stories/fixtures/edge/0.0.5/login.ts',
  requiredScenarios: ['offline', 'offline-no-package', 'online-form', 'error'],
  interactions: [
    '.ige 파일 불러오기 → 프로젝트 이름·버전 표시',
    'Continue → 저장된 계정으로 바로 진입',
    'Sign in with another account → 이메일/비밀번호 폼',
  ],
  platformIntegration: [
    'packageInfo 는 .ige 파일 메타(IPC) 결과',
    'savedSession 은 keytar 에 저장된 마지막 계정',
    '언어 선택은 slot — 앱의 i18n 셀렉터가 들어간다',
  ],
})

const meta = {
  title: 'Pages/Edge/0.0.5/Login',
  component: LoginScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff },
} satisfies Meta<typeof LoginScene>

export default meta
type Story = StoryObj<SceneArgs>

/** 현장 기본 화면 — 프로젝트 파일을 불러온 상태에서 저장된 계정으로 이어 들어간다. */
export const Offline: Story = { args: {} }

/** 파일을 아직 안 불러온 첫 실행. 불러오기 전에는 계정 영역이 나오지 않는다. */
export const OfflineNoPackage: Story = { args: { packageLoaded: false, hasSession: false } }

/** 사무실처럼 네트워크가 있는 곳 — 이메일/비밀번호로 로그인한다. */
export const OnlineForm: Story = { args: { mode: 'online', hasSession: false } }

/** 비밀번호가 틀렸을 때. */
export const Error: Story = {
  args: { mode: 'online', hasSession: false, error: 'Incorrect email or password.' },
}
