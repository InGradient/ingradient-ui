import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import styled from 'styled-components'

export type TextButtonTone = 'accent' | 'muted'
export type TextButtonSize = 'xs' | 'sm'

const FONT_SIZE_MAP: Record<TextButtonSize, string> = {
  xs: 'var(--ig-font-size-xs)',
  sm: 'var(--ig-font-size-sm)',
}

const COLOR_MAP: Record<TextButtonTone, string> = {
  accent: 'var(--ig-color-accent)',
  muted: 'var(--ig-color-text-muted)',
}

const Btn = styled.button<{ $tone: TextButtonTone; $size: TextButtonSize }>`
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
  &:hover:not(:disabled) {
    text-decoration: underline;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export interface TextButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  tone?: TextButtonTone
  size?: TextButtonSize
  iconLeading?: ReactNode
  iconTrailing?: ReactNode
  children: ReactNode
}

/**
 * Borderless text button used for inline actions (link-like CTAs, toggle labels).
 * Hover underlines; tone selects accent vs muted color. Use Button or IconButton
 * when you need a real chrome surface or icon-only target.
 */
export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(function TextButton(
  { tone = 'accent', size = 'sm', iconLeading, iconTrailing, type = 'button', children, ...rest },
  ref,
) {
  return (
    <Btn ref={ref} $tone={tone} $size={size} type={type} {...rest}>
      {iconLeading}
      {children}
      {iconTrailing}
    </Btn>
  )
})
