import React from 'react'
import styled from 'styled-components'
import { Inline, Text } from '../../primitives'

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
  padding: var(--ig-space-3) 0;
  border-bottom: 1px solid var(--ig-color-border-subtle);
  &:last-child {
    border-bottom: none;
  }
`

export interface FilterSectionProps {
  title: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function FilterSection({ title, actions, children, className }: FilterSectionProps) {
  return (
    <Section className={className}>
      <Inline justify="space-between" gap={3}>
        <Text as="h4" tone="muted" size="var(--ig-font-size-xs)" weight={600} uppercase letterSpacing="0.04em">{title}</Text>
        {actions ? <Inline gap={2}>{actions}</Inline> : null}
      </Inline>
      {children}
    </Section>
  )
}
