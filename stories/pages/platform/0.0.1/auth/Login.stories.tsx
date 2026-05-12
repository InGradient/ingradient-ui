import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, Button, Card, Checkbox, PasswordField, TextField } from '@ingradient/ui/components'
import { Stack } from '@ingradient/ui/primitives'
import { BrandLogo } from '@ingradient/ui/brand'
import { mockUsers } from '../../../../fixtures/platform/0.0.1'

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

const logoWrapStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
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

const checkboxRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 'var(--ig-space-3)',
  flexWrap: 'wrap',
}

const footerStyle: React.CSSProperties = {
  margin: 'var(--ig-space-5) 0 0',
  fontSize: 'var(--ig-font-size-sm)',
  color: 'var(--ig-color-text-muted)',
  textAlign: 'center',
}

const linkStyle: React.CSSProperties = {
  color: 'var(--ig-color-accent-soft)',
  textDecoration: 'none',
}

type LoginScene = {
  email?: string
  password?: string
  rememberMe?: boolean
  savePassword?: boolean
  error?: string
  warning?: string
  loading?: boolean
}

function LoginScene(scene: LoginScene) {
  const {
    email = '',
    password = '',
    rememberMe = false,
    savePassword = false,
    error,
    warning,
    loading = false,
  } = scene
  return (
    <div style={pageStyle}>
      <Stack gap={6} style={contentStyle}>
        <div style={logoWrapStyle}><BrandLogo width={220} /></div>
        <Card style={cardStyle}>
          <h1 style={titleStyle}>Sign in</h1>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-4)' }}>
            {warning ? <Alert $tone="warning">{warning}</Alert> : null}
            {error ? <Alert $tone="danger">{error}</Alert> : null}
            <TextField type="email" placeholder="Email" value={email} readOnly disabled={loading} />
            <PasswordField placeholder="Password" value={password} readOnly disabled={loading} />
            <div style={checkboxRowStyle}>
              <Checkbox checked={rememberMe} readOnly disabled={loading} label="Keep me signed in" />
              <Checkbox checked={savePassword} readOnly disabled={loading} label="Remember password" />
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
  title: 'Pages/Platform/0.0.1/Auth/Login',
  component: LoginScene,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof LoginScene>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Filled: Story = {
  args: {
    email: mockUsers[0].email,
    password: '••••••••',
    rememberMe: true,
  },
}

export const ValidationError: Story = {
  args: {
    email: mockUsers[0].email,
    password: '••••',
    error: 'Invalid email or password.',
  },
}

export const Submitting: Story = {
  args: {
    email: mockUsers[0].email,
    password: '••••••••',
    rememberMe: true,
    loading: true,
  },
}
