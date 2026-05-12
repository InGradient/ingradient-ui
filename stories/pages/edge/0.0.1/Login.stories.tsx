import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, Button, Card, ModeSwitcher, PasswordField, TextField } from '@ingradient/ui/components'
import { Stack } from '@ingradient/ui/primitives'
import { BrandLogo } from '@ingradient/ui/brand'

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  padding: 'var(--ig-space-8)',
  background: 'var(--ig-color-bg-canvas)',
}

const contentStyle: React.CSSProperties = {
  width: 'min(440px, calc(100vw - 32px))',
}

const cardStyle: React.CSSProperties = {
  padding: 'var(--ig-space-8)',
  borderRadius: 'var(--ig-radius-xl)',
}

const titleStyle: React.CSSProperties = {
  margin: '0 0 var(--ig-space-6)',
  fontSize: 'var(--ig-font-size-2xl)',
  fontWeight: 600,
  textAlign: 'center',
}

type LoginScene = {
  mode?: 'online' | 'offline'
  email?: string
  password?: string
  error?: string
  loading?: boolean
}

function LoginScene(scene: LoginScene) {
  const { mode = 'online', email = '', password = '', error, loading = false } = scene
  return (
    <div style={pageStyle}>
      <Stack gap={6} style={contentStyle}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BrandLogo width={220} />
        </div>
        <Card style={cardStyle}>
          <h1 style={titleStyle}>Edge Sign in</h1>
          <Stack gap={4}>
            <ModeSwitcher
              size="md"
              value={mode}
              onChange={() => undefined}
              options={[
                { value: 'online', label: 'Online' },
                { value: 'offline', label: 'Offline' },
              ]}
            />
            {error ? <Alert $tone="danger">{error}</Alert> : null}
            {mode === 'online' ? (
              <>
                <TextField type="email" placeholder="Email" value={email} readOnly disabled={loading} />
                <PasswordField placeholder="Password" value={password} readOnly disabled={loading} />
              </>
            ) : (
              <Alert $tone="info">Offline 모드 — 저장된 인증으로 진행합니다.</Alert>
            )}
            <Button type="submit" variant="accent" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </Stack>
        </Card>
      </Stack>
    </div>
  )
}

const meta = {
  title: 'Pages/Edge/0.0.1/Login',
  component: LoginScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', preset: 'edge-0.0.1' },
} satisfies Meta<typeof LoginScene>

export default meta

type Story = StoryObj<typeof meta>

export const Online: Story = { args: { mode: 'online' } }

export const Offline: Story = { args: { mode: 'offline' } }

export const InvalidCredentials: Story = {
  args: { mode: 'online', email: 'operator@line-a.local', password: '••••', error: 'Invalid credentials or device not licensed.' },
}

export const Submitting: Story = {
  args: { mode: 'online', email: 'operator@line-a.local', password: '••••••••', loading: true },
}
