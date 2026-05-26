import styled from 'styled-components'
import { Badge } from '@ingradient/ui'
import type { NicStatusCardViewProps } from '../types'

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
  padding: var(--ig-space-4);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-sm);
  background: var(--ig-color-surface-raised);
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--ig-font-size-sm);
`

const Label = styled.span`color: var(--ig-color-text-muted);`
const Value = styled.span`color: var(--ig-color-text-primary); font-weight: 600;`

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
      <Row>
        <Label>NIC</Label>
        <Value>{status.nicId}</Value>
      </Row>
      <Row>
        <Label>Speed</Label>
        <Value>{status.speed}</Value>
      </Row>
      <Row>
        <Label>Duplex</Label>
        <Value>{status.duplexMode}</Value>
      </Row>
      <Row>
        <Label>Status</Label>
        <Badge $tone={status.isAdminUp && status.isLinkUp ? 'success' : 'danger'}>
          {status.isLinkUp ? 'Up' : 'Down'}
        </Badge>
      </Row>
      {status.configErrors.length > 0 && (
        <ErrorList>
          {status.configErrors.map((err, i) => (<li key={i}>{err}</li>))}
        </ErrorList>
      )}
    </Card>
  )
}
