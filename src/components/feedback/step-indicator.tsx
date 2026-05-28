import styled from 'styled-components'
import { CheckCircle, Circle, XCircle } from 'lucide-react'
import { Spinner } from './spinner'
import { iconSizeNumbers } from '../../tokens/core'

export type StepStatus = 'pending' | 'running' | 'done' | 'error'

export interface StepItem {
  label: string
  status: StepStatus
}

export interface StepIndicatorProps {
  items: StepItem[]
  className?: string
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
`

const Icon = styled.span<{ $status: StepStatus }>`
  flex-shrink: 0;
  color: ${(p) =>
    p.$status === 'done'
      ? 'var(--ig-color-success)'
      : p.$status === 'error'
      ? 'var(--ig-color-danger)'
      : p.$status === 'running'
      ? 'var(--ig-color-accent)'
      : 'var(--ig-color-text-soft)'};
`

const Label = styled.span<{ $status: StepStatus }>`
  font-size: var(--ig-font-size-sm);
  color: ${(p) =>
    p.$status === 'pending' ? 'var(--ig-color-text-soft)' : 'var(--ig-color-text-primary)'};
`

export function StepIndicator({ items, className }: StepIndicatorProps) {
  return (
    <List className={className} role="list">
      {items.map((item, i) => (
        <Row key={i} role="listitem">
          <Icon $status={item.status}>
            {item.status === 'running' && <Spinner size="sm" />}
            {item.status === 'done' && <CheckCircle size={iconSizeNumbers.sm} />}
            {item.status === 'error' && <XCircle size={iconSizeNumbers.sm} />}
            {item.status === 'pending' && <Circle size={iconSizeNumbers.sm} />}
          </Icon>
          <Label $status={item.status}>{item.label || '…'}</Label>
        </Row>
      ))}
    </List>
  )
}
