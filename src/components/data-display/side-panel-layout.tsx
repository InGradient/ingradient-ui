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
  minHeight: 'var(--ig-layout-sidebar-header)',
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
  ariaLabel?: string
  className?: string
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

const HEADING_TAGS = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
} as const

export function SidePanelLayout({ sections, ariaLabel, className, headingLevel = 3 }: SidePanelLayoutProps) {
  return (
    <Stack as="aside" aria-label={ariaLabel} gap={0} className={className} style={PANEL_STYLE}>
      {sections.map((s, i) => (
        <Section key={i}>
          <Inline justify="space-between" gap={3} style={HEADER_ROW_STYLE}>
            <Text as={HEADING_TAGS[headingLevel]} size="var(--ig-font-size-md)" weight="semibold">{s.title}</Text>
            {s.headerActions}
          </Inline>
          <Stack gap={3} style={SECTION_BODY_STYLE}>{s.body}</Stack>
        </Section>
      ))}
    </Stack>
  )
}
