import React from 'react'
import styled from 'styled-components'

const SectionWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

const SectionTitle = styled.div`
  font-size: var(--ig-font-size-sm);
  font-weight: 700;
  color: var(--ig-color-text-primary);
`

const SectionDesc = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  margin-top: calc(-1 * var(--ig-space-2));
`

const RowWrap = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: var(--ig-space-3);
  align-items: start;
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const RowLabel = styled.label`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-muted);
  padding-top: var(--ig-space-3);
`

const RowContent = styled.div`
  min-width: 0;
`

const Hint = styled.div`
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-text-soft);
  margin-top: var(--ig-space-1);
`

// ── FormGroup ────────────────────────────────────────────────────

export interface FormGroupProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormGroup({ title, description, children, className }: FormGroupProps) {
  return (
    <SectionWrap className={className}>
      {title && <SectionTitle>{title}</SectionTitle>}
      {description && <SectionDesc>{description}</SectionDesc>}
      {children}
    </SectionWrap>
  )
}

// ── FieldRow ───────────────────────────────────────────────────────

export interface FieldRowProps {
  label: string
  htmlFor?: string
  hint?: string
  children: React.ReactNode
}

export function FieldRow({ label, htmlFor, hint, children }: FieldRowProps) {
  return (
    <RowWrap>
      <RowLabel htmlFor={htmlFor}>{label}</RowLabel>
      <RowContent>
        {children}
        {hint && <Hint>{hint}</Hint>}
      </RowContent>
    </RowWrap>
  )
}
