import styled, { css } from 'styled-components'
import { stateTitleText } from '../../primitives'
import { statusToneStyles, type StatusTone } from '../../tokens/semantic/states'

export type { StatusTone } from '../../tokens/semantic/states'

export const SmallText = styled.span`
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-xs);
  word-break: break-word;
`

/** @deprecated Use `EmptyState` from `empty-state` instead */
export const EmptyStateText = styled.div`
  ${stateTitleText}
  padding: var(--ig-space-12);
  text-align: center;
`

export const LoadingState = styled(EmptyStateText)`
  text-align: left;
`

export const ErrorState = styled(EmptyStateText)`
  color: var(--ig-color-alert-danger-text);
`

export const StatusPill = styled.span<{ $tone?: StatusTone; tone?: StatusTone }>`
  ${({ $tone, tone }) => {
    const style = statusToneStyles[$tone ?? tone ?? 'idle']
    return css`
      background: ${style.background};
      color: ${style.color};
    `
  }}
  padding: var(--ig-space-1) var(--ig-space-4);
  border-radius: var(--ig-radius-pill);
  font-size: var(--ig-font-size-2xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`
