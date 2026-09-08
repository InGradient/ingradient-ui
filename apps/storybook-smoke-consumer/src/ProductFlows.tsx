import { useState } from 'react'
import { IngradientGlobalStyle, IngradientThemeProvider } from '@ingradient/ui'
import { LoginView } from '@ingradient/platform-pages'
import { LicenseView, type LicenseLabels } from '@ingradient/edge-pages'

const licenseLabels: LicenseLabels = {
  title: 'Edge consumer check', subtitle: 'Local callback smoke test',
  bindHint: 'Bind this test device.', hint: 'Enter a test key to verify the callback.',
  fingerprintLabel: 'Device fingerprint', copy: 'Copy', copied: 'Copied!',
  keyLabel: 'License key', activate: 'Activate', activating: 'Activating…',
  bindButton: 'Bind device', binding: 'Binding…', settingsTitle: 'Settings',
}

function PlatformFlow() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const [rememberPassword, setRememberPassword] = useState(false)
  const [status, setStatus] = useState('Local callback smoke test')
  return <>
    <p role="status">{status}</p>
    <LoginView
      email={email} password={password} keepSignedIn={keepSignedIn}
      rememberPassword={rememberPassword} onEmailChange={setEmail}
      onPasswordChange={setPassword} onKeepSignedInChange={setKeepSignedIn}
      onRememberPasswordChange={setRememberPassword}
      onSubmit={() => setStatus('Sign-in callback received')}
      onNavigateSignup={() => setStatus('Sign-up callback received')}
    />
  </>
}

function EdgeFlow() {
  const [licenseKey, setLicenseKey] = useState('')
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState('Local callback smoke test')
  return <>
    <p role="status">{status}</p>
    <LicenseView
      mode="key" fingerprint="SMOKE-DEVICE" licenseKey={licenseKey}
      submitting={false} copied={copied} error={null} labels={licenseLabels}
      langSelector={null} settingsDialog={null} onLicenseKeyChange={setLicenseKey}
      onSubmit={(event) => { event.preventDefault(); setStatus('Activation callback received') }}
      onBind={() => setStatus('Bind callback received')}
      onCopyFingerprint={async () => {
        await navigator.clipboard.writeText('SMOKE-DEVICE')
        setCopied(true)
      }}
      onOpenSettings={() => setStatus('Settings callback received')}
    />
  </>
}

export function ProductFlows({ product }: { product: 'platform' | 'edge' }) {
  return <IngradientThemeProvider>
    <IngradientGlobalStyle />
    {product === 'platform' ? <PlatformFlow /> : <EdgeFlow />}
  </IngradientThemeProvider>
}
