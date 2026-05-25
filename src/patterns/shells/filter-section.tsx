import React from 'react'
import styled from 'styled-components'
import { Text } from '../../primitives'

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

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-3);
`


const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
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
      <HeaderRow>
        <Text as="h4" tone="muted" size="var(--ig-font-size-xs)" weight={600} uppercase letterSpacing="0.04em">{title}</Text>
        {actions ? <Actions>{actions}</Actions> : null}
      </HeaderRow>
      {children}
    </Section>
  )
}
