import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, Button, Card, Checkbox, PasswordField, TextField } from '@ingradient/ui/components'
import { Stack } from '@ingradient/ui/primitives'
import { BrandLogo } from '@ingradient/ui/brand'
import { platformAuthScenarios, type PlatformAuthScenario } from '../../../../fixtures/platform/0.0.1'
import { scenarioArgType } from '../../../../support/scenarios'
import { defineHandoff } from '../../../../support/handoff'

const handoff = defineHandoff({
  service: 'platform',
  version: '0.0.1',
  page: 'Login',
  referenceStory: 'Pages / Platform / Auth / Login / Default',
  preset: 'platform-0.0.1',
  fixturesPath: 'stories/fixtures/platform/0.0.1/scenarios.ts',
  requiredScenarios: ['default', 'validation-error', 'submitting', 'permission-denied', 'long-text'],
  interactions: [
    'Enter email + password → submit',
    '`Keep me signed in` / `Remember password` checkbox 토글',
    'Submit 중 모든 입력 disabled',
  ],
  platformIntegration: [
    'replace handleSubmit with useLogin() mutation (frontend/features/auth/use-login.ts 패턴)',
    'rememberMe / savePassword 는 auth store 의 setAuthPreferences()',
    'error 는 mutation 의 error.message',
  ],
})

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  padding: 'var(--ig-space-8)',
  background: 'var(--ig-color-bg-canvas)',
}

const contentStyle: React.CSSProperties = { width: 'min(420px, calc(100vw - 32px))' }
const logoWrapStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center' }
const cardStyle: React.CSSProperties = { padding: 'var(--ig-space-8)', borderRadius: 'var(--ig-radius-xl)' }
const titleStyle: React.CSSProperties = {
  margin: '0 0 var(--ig-space-6)', fontSize: 'var(--ig-font-size-2xl)', fontWeight: 600, textAlign: 'center',
}
const checkboxRowStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', gap: 'var(--ig-space-3)', flexWrap: 'wrap',
}
const footerStyle: React.CSSProperties = {
  margin: 'var(--ig-space-5) 0 0', fontSize: 'var(--ig-font-size-sm)', color: 'var(--ig-color-text-muted)', textAlign: 'center',
}
const linkStyle: React.CSSProperties = { color: 'var(--ig-color-accent-soft)', textDecoration: 'none' }

type Args = { scenario: PlatformAuthScenario }

function LoginScene({ scenario }: Args) {
  const scene = platformAuthScenarios[scenario]
  const email = scene.user?.email ?? ''
  const password = scene.password ?? ''
  const rememberMe = scene.rememberMe ?? false
  const loading = scene.loading ?? false

  return (
    <div style={pageStyle}>
      <Stack gap={6} style={contentStyle}>
        <div style={logoWrapStyle}><BrandLogo width={220} /></div>
        <Card style={cardStyle}>
          <h1 style={titleStyle}>Sign in</h1>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-4)' }}>
            {scene.warning ? <Alert $tone="warning">{scene.warning}</Alert> : null}
            {scene.error ? <Alert $tone="danger">{scene.error}</Alert> : null}
            <TextField type="email" placeholder="Email" value={email} readOnly disabled={loading} />
            <PasswordField placeholder="Password" value={password} readOnly disabled={loading} />
            <div style={checkboxRowStyle}>
              <Checkbox checked={rememberMe} readOnly disabled={loading} label="Keep me signed in" />
              <Checkbox checked={false} readOnly disabled={loading} label="Remember password" />
            </div>
            <Button type="submit" variant="accent" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          <p style={footerStyle}>
            Don&apos;t have an account? <a href="#" style={linkStyle}>Sign up</a>
          </p>
        </Card>
      </Stack>
    </div>
  )
}

const meta = {
  title: 'Pages/Platform/Auth/Login',
  component: LoginScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff },
  argTypes: {
    scenario: scenarioArgType(['submitting', 'validation-error']),
  },
  args: { scenario: 'default' },
} satisfies Meta<typeof LoginScene>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { args: { scenario: 'default' } }
export const ValidationError: Story = { args: { scenario: 'validation-error' } }
export const Submitting: Story = { args: { scenario: 'submitting' } }
export const Empty: Story = { args: { scenario: 'empty' } }
export const Error: Story = { args: { scenario: 'error' } }
export const PermissionDenied: Story = { args: { scenario: 'permission-denied' } }
export const LongText: Story = { args: { scenario: 'long-text' } }
