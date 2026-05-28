import React from 'react'
import styled from 'styled-components'

const SectionWrap = styled.div`
  margin-bottom: var(--ig-space-5);
  &:last-child { margin-bottom: 0; }
`

const SectionTitle = styled.div`
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-3);
  margin-bottom: var(--ig-space-3);
`

export interface FilterPopoverSectionProps {
  title: string
  /** Optional right-aligned actions (Select all, Reset, etc.) */
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function FilterPopoverSection({ title, actions, children, className }: FilterPopoverSectionProps) {
  return (
    <SectionWrap className={className}>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        {actions}
      </SectionHeader>
      {children}
    </SectionWrap>
  )
}
