import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import styled from 'styled-components'

export type TextButtonTone = 'accent' | 'muted'
export type TextButtonSize = 'xs' | 'sm'
/** `hover`: underline only on hover (default). `always`: persistent link affordance for inline clear/select actions. */
export type TextButtonUnderline = 'hover' | 'always'

const FONT_SIZE_MAP: Record<TextButtonSize, string> = {
  xs: 'var(--ig-font-size-xs)',
  sm: 'var(--ig-font-size-sm)',
}

const COLOR_MAP: Record<TextButtonTone, string> = {
  accent: 'var(--ig-color-accent)',
  muted: 'var(--ig-color-text-muted)',
}

const Btn = styled.button<{ $tone: TextButtonTone; $size: TextButtonSize; $underline: TextButtonUnderline }>`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
  text-align: left;
  font-family: inherit;
  font-size: ${(p) => FONT_SIZE_MAP[p.$size]};
  color: ${(p) => COLOR_MAP[p.$tone]};
  text-decoration: ${(p) => (p.$underline === 'always' ? 'underline' : 'none')};
  &:hover:not(:disabled) {
    text-decoration: underline;
    ${(p) => (p.$underline === 'always' ? 'color: var(--ig-color-text-primary);' : '')}
  }
  &:focus-visible {
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-space-2px);
    border-radius: var(--ig-radius-xs);
  }
  &:disabled {
    opacity: var(--ig-opacity-disabled);
    cursor: not-allowed;
  }
`

export interface TextButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  tone?: TextButtonTone
  size?: TextButtonSize
  iconLeading?: ReactNode
  iconTrailing?: ReactNode
  underline?: TextButtonUnderline
  children: ReactNode
}

/**
 * Borderless text button used for inline actions (link-like CTAs, toggle labels).
 * Hover underlines; tone selects accent vs muted color. Use Button or IconButton
 * when you need a real chrome surface or icon-only target.
 */
export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(function TextButton(
  { tone = 'accent', size = 'sm', underline = 'hover', iconLeading, iconTrailing, type = 'button', children, ...rest },
  ref,
) {
  return (
    <Btn ref={ref} $tone={tone} $size={size} $underline={underline} type={type} {...rest}>
      {iconLeading}
      {children}
      {iconTrailing}
    </Btn>
  )
})
