import React from 'react'
import styled from 'styled-components'
import { media } from '../../tokens/core/breakpoints'

const RowWrap = styled.div`
  display: grid;
  grid-template-columns: var(--ig-grid-label-col) 1fr;
  gap: var(--ig-space-3);
  align-items: start;
  ${media.sm} {
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

// ── FormField ───────────────────────────────────────────────────────

const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`

const FieldLabelText = styled.label`
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-normal);
`

export interface FormFieldProps {
  label: string
  htmlFor?: string
  children: React.ReactNode
  className?: string
}

export function FormField({ label, htmlFor, children, className }: FormFieldProps) {
  return (
    <FieldWrap className={className}>
      <FieldLabelText htmlFor={htmlFor}>{label}</FieldLabelText>
      {children}
    </FieldWrap>
  )
}
