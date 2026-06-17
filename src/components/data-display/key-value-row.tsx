import React from 'react'
import styled from 'styled-components'

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-4);
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-secondary);

  &:not(:last-child) {
    margin-bottom: var(--ig-space-2);
  }
`

export interface KeyValueRowProps {
  label: React.ReactNode
  value: React.ReactNode
  className?: string
}

export function KeyValueRow({ label, value, className }: KeyValueRowProps) {
  return (
    <Row className={className}>
      <span>{label}</span>
      <span>{value}</span>
    </Row>
  )
}
