import type { ReactNode } from 'react'
import styled from 'styled-components'

const Row = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-4);
  padding: var(--ig-space-4) 0;
  border-bottom: 1px solid var(--ig-color-border-strong);
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
  border-bottom: 1px solid var(--ig-color-border-strong);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-md);
  flex-wrap: wrap;
  &:last-child {
    border-bottom: 0;
  }
`

export interface SettingsRowProps {
  label?: ReactNode
  /** label 좌측 + control 우측 표시. control 은 input/select/checkbox 등 */
  control?: ReactNode
  /** label/control 대신 임의 콘텐츠 (e.g. multi-element row) */
  children?: ReactNode
  /** label 클릭으로 control 활성화 안 되는 경우 (e.g. dropdown) → asLabel false */
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
    return <PlainRow className={className}>{content}</PlainRow>
  }
  return (
    <Row className={className} htmlFor={htmlFor}>
      {content}
    </Row>
  )
}
