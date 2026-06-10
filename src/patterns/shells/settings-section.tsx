import type { ReactNode } from 'react'
import styled from 'styled-components'
import { surfaceRaised } from '../../primitives'

type SettingsSectionTone = 'default' | 'danger'

const Section = styled.section<{ $tone: SettingsSectionTone }>`
  ${surfaceRaised}
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--ig-radius-lg);
  ${(p) => p.$tone === 'danger' && `
    background: var(--ig-color-alert-danger-bg);
    border-color: var(--ig-color-alert-danger-border);
  `}
`

const Title = styled.h3<{ $tone: SettingsSectionTone }>`
  margin: 0;
  padding: var(--ig-space-4) var(--ig-space-5);
  border-bottom: 1px solid var(--ig-color-border-subtle);
  background: var(--ig-color-surface-interactive);
  font-size: var(--ig-font-size-sm);
  font-weight: 600;
  color: var(--ig-color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  ${(p) => p.$tone === 'danger' && `
    background: var(--ig-color-alert-danger-bg);
    border-bottom-color: var(--ig-color-alert-danger-border);
    color: var(--ig-color-alert-danger-text);
  `}
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
  padding: var(--ig-space-5);
`

export interface SettingsSectionProps {
  title?: string
  children: ReactNode
  className?: string
  tone?: SettingsSectionTone
}

export function SettingsSection({ title, children, className, tone = 'default' }: SettingsSectionProps) {
  return (
    <Section className={className} $tone={tone}>
      {title ? <Title $tone={tone}>{title}</Title> : null}
      <Body>{children}</Body>
    </Section>
  )
}
