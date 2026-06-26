import styled from 'styled-components'
import { Badge } from '@ingradient/ui'
import { KeyValueRow } from '@ingradient/ui/components'
import type { NicStatusCardViewProps } from '../types'

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
  padding: var(--ig-space-4);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-sm);
  background: var(--ig-color-surface-raised);
`

const ErrorList = styled.ul`
  margin: var(--ig-space-2) 0 0;
  padding-left: var(--ig-space-5);
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-danger);
`

export function NicStatusCardView({ status, labels }: NicStatusCardViewProps): JSX.Element {
  void labels
  return (
    <Card>
      <KeyValueRow label="NIC" value={status.nicId} />
      <KeyValueRow label="Speed" value={status.speed} />
      <KeyValueRow label="Duplex" value={status.duplexMode} />
      <KeyValueRow
        label="Status"
        value={
          <Badge $tone={status.isAdminUp && status.isLinkUp ? 'success' : 'danger'}>
            {status.isLinkUp ? 'Up' : 'Down'}
          </Badge>
        }
      />
      {status.configErrors.length > 0 && (
        <ErrorList>
          {status.configErrors.map((err, i) => (<li key={i}>{err}</li>))}
        </ErrorList>
      )}
    </Card>
  )
}
