import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Text } from '../../primitives'

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
`


export interface ClassInfoSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export function ClassInfoSection({ title, children, className }: ClassInfoSectionProps) {
  return (
    <Section className={className}>
      <Text as="h3" tone="muted" size="12px" weight={600} uppercase letterSpacing="0.04em">{title}</Text>
      {children}
    </Section>
  )
}
