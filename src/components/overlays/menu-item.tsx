import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import styled, { css } from 'styled-components'

export type MenuItemTone = 'default' | 'danger'
export type MenuItemSize = 'sm' | 'md'

const sizeStyles = {
  sm: css`
    padding: var(--ig-space-2) var(--ig-space-3);
    font-size: var(--ig-font-size-sm);
  `,
  md: css`
    padding: var(--ig-space-3) var(--ig-space-4);
    font-size: var(--ig-font-size-sm);
  `,
}

const TONE_COLOR: Record<MenuItemTone, string> = {
  default: 'var(--ig-color-text-primary)',
  danger: 'var(--ig-color-danger)',
}

const Btn = styled.button<{ $tone: MenuItemTone; $size: MenuItemSize; $active: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  width: 100%;
  border: none;
  border-radius: var(--ig-radius-sm);
  background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-14)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--ig-color-accent)' : TONE_COLOR[p.$tone])};
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  transition: background-color var(--ig-motion-fast);
  ${(p) => sizeStyles[p.$size]}
  &:hover:not(:disabled),
  &[data-active='true']:not(:disabled) {
    background: var(--ig-color-surface-interactive-hover);
  }
  &:disabled {
    opacity: var(--ig-opacity-disabled);
    cursor: not-allowed;
  }
`

export interface MenuItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  tone?: MenuItemTone
  size?: MenuItemSize
  active?: boolean
  iconLeading?: ReactNode
  iconTrailing?: ReactNode
  children: ReactNode
}

/**
 * Menu / dropdown / option list row. Rendered as a `<button>` for keyboard semantics —
 * caller sets `role="menuitem"` or `role="option"` as appropriate.
 * Hover paints with interactive-hover; `active` indicates the current selection
 * (tinted bg + accent text). `tone="danger"` colors destructive entries.
 */
export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(function MenuItem(
  {
    tone = 'default', size = 'sm', active = false,
    iconLeading, iconTrailing, type = 'button', children, ...rest
  },
  ref,
) {
  return (
    <Btn ref={ref} $tone={tone} $size={size} $active={active} type={type} {...rest}>
      {iconLeading}
      {children}
      {iconTrailing}
    </Btn>
  )
})
