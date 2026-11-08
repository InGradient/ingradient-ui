import styled, { css } from 'styled-components'
import { alertToneStyles } from '../../tokens/semantic/states'

export const Alert = styled.div<{ $tone?: keyof typeof alertToneStyles }>`
  ${({ $tone = 'info' }) => css`
    background: ${alertToneStyles[$tone].background};
    border-color: ${alertToneStyles[$tone].border};
    color: ${alertToneStyles[$tone].color};
  `}
  padding: calc(var(--ig-space-5) - var(--ig-border-1px)) calc(var(--ig-space-6) - var(--ig-border-1px));
  border: var(--ig-border-1px) solid;
  border-radius: var(--ig-radius-md);
  font-size: var(--ig-font-size-sm);
  line-height: var(--ig-leading-sm);
`

export const InlineMessage = styled(Alert)`
  padding: calc(var(--ig-space-3) - var(--ig-border-1px)) calc(var(--ig-space-4) - var(--ig-border-1px));
  font-size: var(--ig-font-size-xs);
  line-height: var(--ig-leading-xs);
`
