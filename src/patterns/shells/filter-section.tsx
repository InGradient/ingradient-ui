import React from 'react'
import styled from 'styled-components'

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

const Title = styled.h4`
  margin: 0;
  font-size: var(--ig-font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--ig-color-text-muted);
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
        <Title>{title}</Title>
        {actions ? <Actions>{actions}</Actions> : null}
      </HeaderRow>
      {children}
    </Section>
  )
}
