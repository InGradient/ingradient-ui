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
