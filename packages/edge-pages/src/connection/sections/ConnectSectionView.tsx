import styled from 'styled-components'
import { Button, SectionTitle, Spinner, iconSizeNumbers } from '@ingradient/ui'
import { CheckCircleIcon, AlertCircleIcon } from '@ingradient/ui/components'
import { FlatSection } from '../ConnectionTabView.styles'
import type { ConnectSectionViewProps } from '../types'

const ErrorMsg = styled.div`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-danger);
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
  margin-top: var(--ig-space-3);
`

const ConnectedMsg = styled.div`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-success);
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
`

export function ConnectSectionView(props: ConnectSectionViewProps): JSX.Element {
  const { isConnecting, isConnected, connectionError, canConnect, labels, onConnect, onDisconnect } = props
  return (
    <FlatSection>
      <SectionTitle>{labels.connectTitle}</SectionTitle>
      <div style={{ display: 'flex', gap: 'var(--ig-space-3)', alignItems: 'center' }}>
        {isConnected ? (
          <Button size="sm" variant="secondary" onClick={onDisconnect}>{labels.disconnect}</Button>
        ) : (
          <Button size="sm" variant="accent" onClick={onConnect} disabled={!canConnect || isConnecting}>
            {isConnecting && <Spinner size="sm" tone="muted" />}
            {isConnecting ? labels.connecting : labels.connect}
          </Button>
        )}
        {isConnected && <ConnectedMsg><CheckCircleIcon size={iconSizeNumbers.sm} />Connected</ConnectedMsg>}
      </div>
      {connectionError && <ErrorMsg><AlertCircleIcon size={iconSizeNumbers.sm} />{connectionError}</ErrorMsg>}
    </FlatSection>
  )
}
