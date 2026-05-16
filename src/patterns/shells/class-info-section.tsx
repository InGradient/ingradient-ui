import type { ReactNode } from 'react'
import styled from 'styled-components'

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Title = styled.h3`
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

export interface ClassInfoSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export function ClassInfoSection({ title, children, className }: ClassInfoSectionProps) {
  return (
    <Section className={className}>
      <Title>{title}</Title>
      {children}
    </Section>
  )
}
