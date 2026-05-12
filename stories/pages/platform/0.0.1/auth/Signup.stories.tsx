import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, Button, Card, PasswordField, TextField } from '@ingradient/ui/components'
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

type SignupScene = {
  email?: string
  name?: string
  organization?: string
  password?: string
  error?: string
  loading?: boolean
}

function SignupScene(scene: SignupScene) {
  const {
    email = '',
    name = '',
    organization = '',
    password = '',
    error,
    loading = false,
  } = scene
  return (
    <div style={pageStyle}>
      <Stack gap={6} style={contentStyle}>
        <div style={logoWrapStyle}><BrandLogo width={220} /></div>
        <Card style={cardStyle}>
          <h1 style={titleStyle}>Sign up</h1>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-4)' }}>
            {error ? <Alert $tone="danger">{error}</Alert> : null}
            <TextField type="email" placeholder="Email" value={email} readOnly disabled={loading} />
            <TextField type="text" placeholder="Name" value={name} readOnly disabled={loading} />
            <TextField type="text" placeholder="Organization" value={organization} readOnly disabled={loading} />
            <PasswordField placeholder="Password" value={password} readOnly disabled={loading} />
            <Button type="submit" variant="accent" disabled={loading}>
              {loading ? 'Signing up…' : 'Sign up'}
            </Button>
          </form>
          <p style={footerStyle}>
            Already have an account? <a href="#" style={linkStyle}>Sign in</a>
          </p>
        </Card>
      </Stack>
    </div>
  )
}

const meta = {
  title: 'Pages/Platform/0.0.1/Auth/Signup',
  component: SignupScene,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SignupScene>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const PasswordMismatch: Story = {
  args: {
    email: 'newuser@acme.io',
    name: mockUsers[1].name,
    organization: mockUsers[1].organization,
    password: '••••••',
    error: 'Password does not meet requirements (min 8 chars).',
  },
}

export const Submitting: Story = {
  args: {
    email: 'newuser@acme.io',
    name: mockUsers[1].name,
    organization: mockUsers[1].organization,
    password: '••••••••',
    loading: true,
  },
}
