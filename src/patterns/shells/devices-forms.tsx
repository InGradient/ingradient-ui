import { forwardRef, type Ref } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { CopyButton } from '../../components/inputs/copy-button'
import { DropdownSelect } from '../../components/inputs/dropdown-select'
import { TextField } from '../../components/inputs/text-fields'

const FormBox = styled.div`
  background: var(--ig-color-surface-raised);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  padding: var(--ig-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

const FormRow = styled.div`
  display: flex;
  gap: var(--ig-space-3);
  align-items: center;
  flex-wrap: wrap;
`

const FormLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--ig-color-text-muted);
`

const ErrMsg = styled.span`
  font-size: 12px;
  color: var(--ig-color-danger);
`

const TokenBox = styled.div`
  background: var(--ig-color-surface-raised);
  border: 1px solid var(--ig-color-accent);
  border-radius: var(--ig-radius-xs);
  padding: var(--ig-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
`

const TokenLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--ig-color-text-muted);
`

const TokenText = styled.textarea`
  width: 100%;
  min-height: 72px;
  background: var(--ig-color-surface-panel);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  padding: var(--ig-space-3);
  font-family: monospace;
  font-size: 11px;
  color: var(--ig-color-text-primary);
  resize: vertical;
  box-sizing: border-box;
`

const TokenFooter = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  flex-wrap: wrap;
`

const TokenMeta = styled.span`
  font-size: 12px;
  color: var(--ig-color-text-muted);
`

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
        <TokenBox>
          <TokenLabel>
            Offline License Token — device: {issuedToken.deviceUid} · valid until {new Date(issuedToken.validUntil).toLocaleString()}
          </TokenLabel>
          <TokenText readOnly value={issuedToken.token} />
          <TokenFooter>
            <CopyButton value={issuedToken.token} size="sm">Copy</CopyButton>
            <TokenMeta>Paste this token into the Edge app's license field.</TokenMeta>
          </TokenFooter>
        </TokenBox>
      </div>
    ) : null
  }

  const deviceOptions = activeDevices.length === 0
    ? [{ value: '', label: 'No active devices' }]
    : activeDevices.map((d) => ({ value: d.id, label: d.name ? `${d.name} (${d.deviceUid})` : d.deviceUid }))

  return (
    <div ref={ref}>
      {showRegister ? (
        <FormBox>
          <FormLabel>Register a new device by entering the Device UID shown in the Edge app.</FormLabel>
          <FormRow>
            <TextField
              ref={uidInputRef}
              placeholder="Device UID"
              value={registerUid}
              onChange={(e) => onChangeRegisterUid(e.target.value)}
              title="Device UID"
              style={{ flex: 1 }}
            />
            <TextField
              placeholder="Name (optional)"
              value={registerName}
              onChange={(e) => onChangeRegisterName(e.target.value)}
              title="Device name"
              style={{ width: 160 }}
            />
            <Button type="button" onClick={onRegister} disabled={!!registering || !registerUid.trim()}>
              {registering ? 'Registering…' : 'Register'}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancelRegister}>Cancel</Button>
          </FormRow>
          {registerError ? <ErrMsg>{registerError}</ErrMsg> : null}
        </FormBox>
      ) : null}

      {showIssue && offlineEnabled ? (
        <FormBox>
          <FormLabel>Select a registered device to issue an offline license token.</FormLabel>
          <FormRow>
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
              style={{ width: 200 }}
            />
            <Button type="button" onClick={onIssue} disabled={!!issuing || !issueDeviceId || activeDevices.length === 0}>
              {issuing ? 'Issuing…' : 'Issue'}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancelIssue}>Cancel</Button>
          </FormRow>
        </FormBox>
      ) : null}

      {issuedToken ? (
        <TokenBox>
          <TokenLabel>
            Offline License Token — device: {issuedToken.deviceUid} · valid until {new Date(issuedToken.validUntil).toLocaleString()}
          </TokenLabel>
          <TokenText readOnly value={issuedToken.token} />
          <TokenFooter>
            <CopyButton value={issuedToken.token} size="sm">Copy</CopyButton>
            <TokenMeta>Paste this token into the Edge app's license field.</TokenMeta>
          </TokenFooter>
        </TokenBox>
      ) : null}
    </div>
  )
})
