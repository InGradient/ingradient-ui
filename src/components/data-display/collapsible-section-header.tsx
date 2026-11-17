import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Inline, Text } from '../../primitives'
import { iconSizeNumbers } from '../../tokens/core'
import { ChevronDownIcon, ChevronRightIcon } from '../icons/catalog-icons'

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
  /** Id of the collapsible body, announced through `aria-controls`. */
  controls?: string
  badge?: ReactNode
  className?: string
}

/**
 * Section header with a chevron icon + uppercase label + optional trailing badge,
 * rendered as a `<button>` so it can toggle a collapsible body.
 * Used by sidebar panels (Comments, Labelers, etc.).
 */
export function CollapsibleSectionHeader({
  title, open, onClick, badge, className, controls,
}: CollapsibleSectionHeaderProps) {
  return (
    <Btn type="button" onClick={onClick} className={className} aria-expanded={open} aria-controls={controls}>
      <Inline as="span" gap="var(--ig-space-1px)">
        <Text as="span" tone="muted" aria-hidden="true" style={{ display: 'inline-flex' }}>
          {open ? <ChevronDownIcon size={iconSizeNumbers.xs} /> : <ChevronRightIcon size={iconSizeNumbers.xs} />}
        </Text>
        <Text as="span" size="var(--ig-font-size-sm)" weight="semibold" tone="muted" uppercase letterSpacing="normal">{title}</Text>
      </Inline>
      {badge}
    </Btn>
  )
}
