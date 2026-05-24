import type { ReactNode } from 'react'
import styled from 'styled-components'

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-5);
`

const Title = styled.h3`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

export interface SettingsSectionProps {
  title?: string
  children: ReactNode
  className?: string
}

export function SettingsSection({ title, children, className }: SettingsSectionProps) {
  return (
    <Section className={className}>
      {title ? <Title>{title}</Title> : null}
      {children}
    </Section>
  )
}
