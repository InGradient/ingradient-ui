import type { ReactNode } from 'react'
import styled from 'styled-components'

const Row = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-4);
  padding: var(--ig-space-4) 0;
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-strong);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-md);
  &:last-child {
    border-bottom: 0;
  }
`

const PlainRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-4);
  padding: var(--ig-space-4) 0;
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-strong);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-md);
  flex-wrap: wrap;
  &:last-child {
    border-bottom: 0;
  }
`

export interface SettingsRowProps {
  label?: ReactNode
  control?: ReactNode
  children?: ReactNode
  asLabel?: boolean
  htmlFor?: string
  className?: string
}

export function SettingsRow({ label, control, children, asLabel = true, htmlFor, className }: SettingsRowProps) {
  const content = children ?? (
    <>
      <span>{label}</span>
      {control}
    </>
  )
  if (!asLabel) {
    return (
      <PlainRow className={className}>
        {content}
      </PlainRow>
    )
  }
  return (
    <Row className={className} {...(htmlFor ? { htmlFor } : {})}>
      {content}
    </Row>
  )
}
