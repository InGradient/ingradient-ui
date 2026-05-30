import { forwardRef, type Ref } from 'react'
import { Inline, Stack, Text } from '@ingradient/ui/primitives'
import { Button } from '@ingradient/ui/components'
import { CopyButton } from '@ingradient/ui/components'
import { DropdownSelect } from '@ingradient/ui/components'
import { TextField } from '@ingradient/ui/components'
import { Textarea } from '@ingradient/ui/components'

const FORM_BOX_STYLE = {
  background: 'var(--ig-color-surface-raised)',
  border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
  borderRadius: 'var(--ig-radius-xxs)',
  padding: 'var(--ig-space-5)',
}

const TOKEN_BOX_STYLE = {
  background: 'var(--ig-color-surface-raised)',
  border: 'var(--ig-border-1px) solid var(--ig-color-accent)',
  borderRadius: 'var(--ig-radius-xxs)',
  padding: 'var(--ig-space-5)',
}

const FLEX_1_STYLE = { flex: 1 }
const WIDTH_160_STYLE = { width: 160 }
const WIDTH_200_STYLE = { width: 200 }


export interface IssuedToken {
  token: string
  validUntil: string
  deviceUid: string
}

export interface DeviceOption {
  id: string
  deviceUid: string
  name?: string | null
}

export interface DevicesFormsProps {
  isAdmin?: boolean
  offlineEnabled?: boolean

  showRegister?: boolean
  registerUid: string
  onChangeRegisterUid: (value: string) => void
  registerName: string
  onChangeRegisterName: (value: string) => void
  registering?: boolean
  registerError?: string | null
  uidInputRef?: Ref<HTMLInputElement>
  onRegister: () => void
  onCancelRegister?: () => void

  showIssue?: boolean
  activeDevices: DeviceOption[]
  issueDeviceId: string
  onChangeIssueDeviceId: (value: string) => void
  issueValidDays: string
  onChangeIssueValidDays: (value: string) => void
  issuing?: boolean
  onIssue: () => void
  onCancelIssue?: () => void

  issuedToken?: IssuedToken | null
}

export const DevicesForms = forwardRef<HTMLDivElement, DevicesFormsProps>(function DevicesForms({
  isAdmin, offlineEnabled,
  showRegister, registerUid, onChangeRegisterUid, registerName, onChangeRegisterName,
  registering, registerError, uidInputRef, onRegister, onCancelRegister,
  showIssue, activeDevices, issueDeviceId, onChangeIssueDeviceId,
  issueValidDays, onChangeIssueValidDays, issuing, onIssue, onCancelIssue,
  issuedToken,
}, ref) {
  if (!isAdmin) {
    return issuedToken ? (
      <div ref={ref}>
        <Stack gap={3} style={TOKEN_BOX_STYLE}>
          <Text size="var(--ig-font-size-xs)" weight={500} tone="muted">
            Offline License Token — device: {issuedToken.deviceUid} · valid until {new Date(issuedToken.validUntil).toLocaleString()}
          </Text>
          <Textarea variant="monospace" minHeight={72} readOnly value={issuedToken.token} />
          <Inline gap={3} wrap="wrap">
            <CopyButton value={issuedToken.token} size="sm">Copy</CopyButton>
            <Text size="var(--ig-font-size-xs)" tone="muted">Paste this token into the Edge app's license field.</Text>
          </Inline>
        </Stack>
      </div>
    ) : null
  }

  const deviceOptions = activeDevices.length === 0
    ? [{ value: '', label: 'No active devices' }]
    : activeDevices.map((d) => ({ value: d.id, label: d.name ? `${d.name} (${d.deviceUid})` : d.deviceUid }))

  return (
    <div ref={ref}>
      {showRegister ? (
        <Stack gap={4} style={FORM_BOX_STYLE}>
          <Text size="var(--ig-font-size-xs)" weight={500} tone="muted">Register a new device by entering the Device UID shown in the Edge app.</Text>
          <Inline gap={3} wrap="wrap">
            <TextField
              ref={uidInputRef}
              placeholder="Device UID"
              value={registerUid}
              onChange={(e) => onChangeRegisterUid(e.target.value)}
              title="Device UID"
              style={FLEX_1_STYLE}
            />
            <TextField
              placeholder="Name (optional)"
              value={registerName}
              onChange={(e) => onChangeRegisterName(e.target.value)}
              title="Device name"
              style={WIDTH_160_STYLE}
            />
            <Button type="button" onClick={onRegister} disabled={!!registering || !registerUid.trim()}>
              {registering ? 'Registering…' : 'Register'}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancelRegister}>Cancel</Button>
          </Inline>
          {registerError ? <Text size="var(--ig-font-size-xs)" tone="danger">{registerError}</Text> : null}
        </Stack>
      ) : null}

      {showIssue && offlineEnabled ? (
        <Stack gap={4} style={FORM_BOX_STYLE}>
          <Text size="var(--ig-font-size-xs)" weight={500} tone="muted">Select a registered device to issue an offline license token.</Text>
          <Inline gap={3} wrap="wrap">
            <DropdownSelect
              value={issueDeviceId}
              options={deviceOptions}
              onChange={onChangeIssueDeviceId}
            />
            <TextField
              type="number"
              min={1}
              max={365}
              placeholder="Valid days (default server setting)"
              value={issueValidDays}
              onChange={(e) => onChangeIssueValidDays(e.target.value)}
              title="Offline token valid days (1-365)"
              style={WIDTH_200_STYLE}
            />
            <Button type="button" onClick={onIssue} disabled={!!issuing || !issueDeviceId || activeDevices.length === 0}>
              {issuing ? 'Issuing…' : 'Issue'}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancelIssue}>Cancel</Button>
          </Inline>
        </Stack>
      ) : null}

      {issuedToken ? (
        <Stack gap={3} style={TOKEN_BOX_STYLE}>
          <Text size="var(--ig-font-size-xs)" weight={500} tone="muted">
            Offline License Token — device: {issuedToken.deviceUid} · valid until {new Date(issuedToken.validUntil).toLocaleString()}
          </Text>
          <Textarea variant="monospace" minHeight={72} readOnly value={issuedToken.token} />
          <Inline gap={3} wrap="wrap">
            <CopyButton value={issuedToken.token} size="sm">Copy</CopyButton>
            <Text size="var(--ig-font-size-xs)" tone="muted">Paste this token into the Edge app's license field.</Text>
          </Inline>
        </Stack>
      ) : null}
    </div>
  )
})
