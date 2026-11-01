import styled from 'styled-components'
import { Badge, Card, Stack } from '@ingradient/ui'
import { KeyValueRow } from '@ingradient/ui/components'
import type { NicStatusCardViewProps } from '../types'

const ErrorList = styled.ul`
  margin: var(--ig-spacing-8) 0 0;
  padding-left: var(--ig-spacing-12);
  font-size: var(--ig-text-caption);
  color: var(--ig-color-danger);
`

export function NicStatusCardView({ status, labels }: NicStatusCardViewProps): JSX.Element {
  void labels
  return (
    <Card elevation="raised" flat radius="var(--ig-radius-sm)" padding="var(--ig-spacing-8)">
      <Stack gap="var(--ig-spacing-8)">
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
      </Stack>
    </Card>
  )
}
