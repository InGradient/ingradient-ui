import styled, { css } from 'styled-components'
import { statusToneStyles, type StatusTone } from '../../tokens/semantic/states'

export type { StatusTone } from '../../tokens/semantic/states'

export const SmallText = styled.span`
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-xs);
  word-break: break-word;
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
  font-weight: var(--ig-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-wide);
`
