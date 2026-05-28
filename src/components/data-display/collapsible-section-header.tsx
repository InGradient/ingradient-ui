import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Inline, Text } from '../../primitives'

const Btn = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-2);
  padding: var(--ig-space-2) 0;
  background: none;
  border: none;
  cursor: pointer;
  user-select: none;
`

export interface CollapsibleSectionHeaderProps {
  title: string
  open: boolean
  onClick: () => void
  badge?: ReactNode
  className?: string
}

/**
 * Section header with chevron + uppercase label + optional trailing badge,
 * rendered as a `<button>` so it can toggle a collapsible body.
 * Used by sidebar panels (Comments, Labelers, etc.).
 */
export function CollapsibleSectionHeader({
  title, open, onClick, badge, className,
}: CollapsibleSectionHeaderProps) {
  return (
    <Btn type="button" onClick={onClick} className={className}>
      <Inline as="span" gap={1}>
        <Text as="span">{open ? '▾' : '▸'}</Text>
        <Text as="span" size="var(--ig-font-size-sm)" weight="semibold" tone="muted" uppercase letterSpacing="0.04em">{title}</Text>
      </Inline>
      {badge}
    </Btn>
  )
}
