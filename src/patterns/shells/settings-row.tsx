import type { ReactNode } from 'react'
import { Inline } from '../../primitives'

const ROW_STYLE = {
  padding: 'var(--ig-space-5) 0',
  borderBottom: '1px solid var(--ig-color-border-strong)',
  color: 'var(--ig-color-text-primary)',
  fontSize: 14,
}

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
    return (
      <Inline justify="space-between" gap={7} wrap="wrap" className={className} style={ROW_STYLE}>
        {content}
      </Inline>
    )
  }
  return (
    <Inline as="label" justify="space-between" gap={7} className={className} style={ROW_STYLE} {...(htmlFor ? { htmlFor } : {})}>
      {content}
    </Inline>
  )
}
