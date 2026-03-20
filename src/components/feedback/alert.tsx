import styled, { css } from 'styled-components'
import { alertToneStyles } from '../../tokens/variants'

export const Alert = styled.div<{ $tone?: keyof typeof alertToneStyles }>`
  ${({ $tone = 'info' }) => css`
    background: ${alertToneStyles[$tone].background};
    border-color: ${alertToneStyles[$tone].border};
    color: ${alertToneStyles[$tone].color};
  `}
  padding: var(--ig-space-5) var(--ig-space-6);
  border: 1px solid;
  border-radius: var(--ig-radius-md);
  font-size: var(--ig-font-size-sm);
`

export const InlineMessage = styled(Alert)`
  padding: var(--ig-space-3) var(--ig-space-4);
  font-size: var(--ig-font-size-xs);
`
