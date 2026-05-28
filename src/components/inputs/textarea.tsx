import { forwardRef, type TextareaHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

export type TextareaVariant = 'default' | 'monospace'

const variantStyles = {
  default: css`
    font-family: inherit;
    font-size: var(--ig-font-size-sm);
  `,
  monospace: css`
    font-family: monospace;
    font-size: var(--ig-font-size-2xs);
  `,
}

const Field = styled.textarea<{ $variant: TextareaVariant; $minHeight: number }>`
  width: 100%;
  min-height: ${(p) => p.$minHeight}px;
  padding: var(--ig-space-3);
  background: var(--ig-color-surface-muted);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-md);
  color: var(--ig-color-text-primary);
  resize: vertical;
  box-sizing: border-box;
  ${(p) => variantStyles[p.$variant]}
  &::placeholder {
    color: var(--ig-color-text-soft);
  }
  &:focus-visible {
    outline: none;
    border-color: var(--ig-color-accent);
  }
`

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextareaVariant
  minHeight?: number
}

/**
 * Multi-line text field. Use `variant="monospace"` for token / code / IP-list inputs.
 * `minHeight` (px) controls the initial vertical room — user can still drag-resize.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { variant = 'default', minHeight = 60, ...rest },
  ref,
) {
  return <Field ref={ref} $variant={variant} $minHeight={minHeight} {...rest} />
})
