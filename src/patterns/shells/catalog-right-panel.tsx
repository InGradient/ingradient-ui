import React from 'react'
import styled from 'styled-components'

const Panel = styled.aside`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--ig-color-surface-panel);
  overflow-y: auto;
  flex-shrink: 0;
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--ig-catalog-divider-color, var(--ig-color-border-subtle));
  &:last-child {
    border-bottom: none;
  }
`

const SectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-3);
  min-height: 72px;
  padding: 0 var(--ig-space-7);
`

const SectionTitle = styled.h3`
  margin: 0;
  font-size: var(--ig-font-size-md);
  font-weight: 600;
  color: var(--ig-color-text-primary);
`

const SectionBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
  padding: 0 var(--ig-space-7) var(--ig-space-7);
`

export interface CatalogRightPanelSection {
  title: React.ReactNode
  headerActions?: React.ReactNode
  body: React.ReactNode
}

export interface CatalogRightPanelProps {
  sections: CatalogRightPanelSection[]
  className?: string
}

export function CatalogRightPanel({ sections, className }: CatalogRightPanelProps) {
  return (
    <Panel className={className}>
      {sections.map((s, i) => (
        <Section key={i}>
          <SectionHeaderRow>
            <SectionTitle>{s.title}</SectionTitle>
            {s.headerActions}
          </SectionHeaderRow>
          <SectionBody>{s.body}</SectionBody>
        </Section>
      ))}
    </Panel>
  )
}
