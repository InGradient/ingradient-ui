import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, Button, Card, ModeSwitcher, PasswordField, TextField } from '@ingradient/ui/components'
import { Stack } from '@ingradient/ui/primitives'
import { defineHandoff } from '../../../support/handoff'

const handoff = defineHandoff({
  service: 'medical',
  version: '0.0.1',
  page: 'Auth',
  referenceStory: 'Pages / Medical / Auth / Login',
  preset: 'medical-0.0.1',
  fixturesPath: '(없음 — 단순 form)',
  requiredScenarios: ['login', 'signup', 'invalid-credentials', 'submitting'],
  interactions: [
    'Sign in / Sign up 모드 토글',
    'Sign up 모드에서는 Name 필드 추가 노출',
    'submit 중 모든 입력 disabled',
  ],
  platformIntegration: [
    'replace handleSubmit with login/signup API (medilabel Next.js auth endpoint)',
    'JWT 발급 후 cookie 설정',
    'invalid credentials 시 form 상단 Alert',
  ],
})

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  padding: 'var(--ig-space-8)',
  background: 'var(--ig-color-bg-canvas)',
}

const contentStyle: React.CSSProperties = {
  width: 'min(420px, calc(100vw - 32px))',
}

const cardStyle: React.CSSProperties = {
  padding: 'var(--ig-space-8)',
  borderRadius: 'var(--ig-radius-xl)',
}

const titleStyle: React.CSSProperties = {
  margin: '0 0 var(--ig-space-2)',
  fontSize: 'var(--ig-font-size-2xl)',
  fontWeight: 600,
  textAlign: 'center',
}

const subtitleStyle: React.CSSProperties = {
  margin: '0 0 var(--ig-space-6)',
  fontSize: 'var(--ig-font-size-sm)',
  color: 'var(--ig-color-text-muted)',
  textAlign: 'center',
}

type Scene = {
  mode?: 'login' | 'signup'
  email?: string
  password?: string
  name?: string
  error?: string
  loading?: boolean
}

function AuthScene(scene: Scene) {
  const { mode = 'login', email = '', password = '', name = '', error, loading = false } = scene
  return (
    <div style={pageStyle}>
      <Stack gap={6} style={contentStyle}>
        <Card style={cardStyle}>
          <h1 style={titleStyle}>medilabel</h1>
          <p style={subtitleStyle}>의료 영상 라벨링 워크스페이스</p>
          <Stack gap={4}>
            <ModeSwitcher
              size="md"
              value={mode}
              onChange={() => undefined}
              options={[
                { value: 'login', label: 'Sign in' },
                { value: 'signup', label: 'Sign up' },
              ]}
            />
            {error ? <Alert $tone="danger">{error}</Alert> : null}
            {mode === 'signup' ? (
              <TextField type="text" placeholder="Name" value={name} readOnly disabled={loading} />
            ) : null}
            <TextField type="email" placeholder="Email" value={email} readOnly disabled={loading} />
            <PasswordField placeholder="Password" value={password} readOnly disabled={loading} />
            <Button type="submit" variant="accent" disabled={loading}>
              {loading ? (mode === 'login' ? 'Signing in…' : 'Creating account…') : mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>
          </Stack>
        </Card>
      </Stack>
    </div>
  )
}

const meta = {
  title: 'Pages/Medical/Auth',
  component: AuthScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff },
} satisfies Meta<typeof AuthScene>

export default meta

type Story = StoryObj<typeof meta>

export const Login: Story = { args: { mode: 'login' } }
export const Signup: Story = { args: { mode: 'signup' } }
export const InvalidCredentials: Story = {
  args: { mode: 'login', email: 'doctor@hospital.org', password: '••••', error: 'Invalid credentials.' },
}
export const Submitting: Story = {
  args: { mode: 'login', email: 'doctor@hospital.org', password: '••••••••', loading: true },
}
