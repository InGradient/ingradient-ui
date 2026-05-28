import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Inline, Stack, Text } from '../../primitives'

const PANEL_STYLE = {
  height: '100%',
  background: 'var(--ig-color-surface-panel)',
  overflowY: 'auto' as const,
  flexShrink: 0,
}

const HEADER_ROW_STYLE = {
  minHeight: 72,
  padding: '0 var(--ig-space-7)',
}

const SECTION_BODY_STYLE = {
  padding: '0 var(--ig-space-7) var(--ig-space-7)',
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  &:last-child {
    border-bottom: none;
  }
`

export interface SidePanelLayoutSection {
  title: ReactNode
  headerActions?: ReactNode
  body: ReactNode
}

export interface SidePanelLayoutProps {
  sections: SidePanelLayoutSection[]
  className?: string
}

export function SidePanelLayout({ sections, className }: SidePanelLayoutProps) {
  return (
    <Stack as="aside" gap={0} className={className} style={PANEL_STYLE}>
      {sections.map((s, i) => (
        <Section key={i}>
          <Inline justify="space-between" gap={3} style={HEADER_ROW_STYLE}>
            <Text as="h3" size="var(--ig-font-size-md)" weight={600}>{s.title}</Text>
            {s.headerActions}
          </Inline>
          <Stack gap={3} style={SECTION_BODY_STYLE}>{s.body}</Stack>
        </Section>
      ))}
    </Stack>
  )
}
