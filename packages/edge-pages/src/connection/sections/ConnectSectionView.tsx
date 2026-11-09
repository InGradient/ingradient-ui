import styled from 'styled-components'
import { Button, SectionTitle, Spinner, iconSizeNumbers } from '@ingradient/ui'
import { CheckCircleIcon, AlertCircleIcon } from '@ingradient/ui/components'
import { Inline, Stack } from '@ingradient/ui/primitives'
import type { ConnectSectionViewProps } from '../types'

const ErrorMsg = styled.div`
  font-size: var(--ig-text-body-sm);
  line-height: var(--ig-text-body-sm-leading);
  color: var(--ig-color-danger);
  display: flex;
  align-items: center;
  gap: var(--ig-spacing-8);
  margin-top: var(--ig-spacing-8);
`

const ConnectedMsg = styled.div`
  font-size: var(--ig-text-body-sm);
  line-height: var(--ig-text-body-sm-leading);
  color: var(--ig-color-success);
  display: flex;
  align-items: center;
  gap: var(--ig-spacing-8);
`

export function ConnectSectionView(props: ConnectSectionViewProps): JSX.Element {
  const { isConnecting, isConnected, connectionError, canConnect, labels, onConnect, onDisconnect } = props
  return (
    <Stack as="section" gap="var(--ig-spacing-12)" style={{ marginBottom: 'var(--ig-spacing-16)' }}>
      <SectionTitle>{labels.connectTitle}</SectionTitle>
      <Inline gap="var(--ig-spacing-8)" align="center" wrap="nowrap">
        {isConnected ? (
          <Button size="sm" variant="secondary" onClick={onDisconnect}>{labels.disconnect}</Button>
        ) : (
          <Button size="sm" variant="accent" onClick={onConnect} disabled={!canConnect || isConnecting}>
            {isConnecting && <Spinner size="sm" tone="muted" />}
            {isConnecting ? labels.connecting : labels.connect}
          </Button>
        )}
        {isConnected && <ConnectedMsg><CheckCircleIcon size={iconSizeNumbers.sm} />Connected</ConnectedMsg>}
      </Inline>
      {connectionError && <ErrorMsg><AlertCircleIcon size={iconSizeNumbers.sm} />{connectionError}</ErrorMsg>}
    </Stack>
  )
}
