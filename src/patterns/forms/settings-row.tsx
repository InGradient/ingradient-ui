import type { ReactNode } from 'react'
import styled from 'styled-components'

import { Text } from '../../primitives'

const Row = styled.label<{ $divider: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-4);
  padding: ${(p) => (p.$divider ? 'var(--ig-space-4) 0' : '0')};
  border-bottom: ${(p) => (p.$divider ? 'var(--ig-border-1px) solid var(--ig-color-border-strong)' : 'none')};
  color: var(--ig-color-text-primary);
  font-size: ${(p) => (p.$divider ? 'var(--ig-font-size-md)' : 'var(--ig-font-size-xs)')};
  &:last-child {
    border-bottom: 0;
  }
`

const PlainRow = styled.div<{ $divider: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-4);
  padding: ${(p) => (p.$divider ? 'var(--ig-space-4) 0' : '0')};
  border-bottom: ${(p) => (p.$divider ? 'var(--ig-border-1px) solid var(--ig-color-border-strong)' : 'none')};
  color: var(--ig-color-text-primary);
  font-size: ${(p) => (p.$divider ? 'var(--ig-font-size-md)' : 'var(--ig-font-size-xs)')};
  flex-wrap: wrap;
  &:last-child {
    border-bottom: 0;
  }
`

/** 이름 아래 한 줄 설명 — 왜 이 설정이 있는지 알려주는 자리. */
const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-1);
  min-width: 0;
`

export interface SettingsRowProps {
  label?: ReactNode
  /** 이름 아래 한 줄 설명. 없으면 이름만 남는다. */
  description?: ReactNode
  control?: ReactNode
  children?: ReactNode
  asLabel?: boolean
  /** 구분선과 세로 여백. 촘촘한 목록(설정 탭 안쪽)에서는 끈다. */
  divider?: boolean
  htmlFor?: string
  className?: string
}

export function SettingsRow({
  label, description, control, children,
  asLabel = true, divider = true, htmlFor, className,
}: SettingsRowProps) {
  const content = children ?? (
    <>
      {description != null ? (
        <TextBlock>
          <span>{label}</span>
          <Text as="span" tone="muted" size="var(--ig-font-size-2xs)">{description}</Text>
        </TextBlock>
      ) : (
        <span>{label}</span>
      )}
      {control}
    </>
  )
  if (!asLabel) {
    return (
      <PlainRow $divider={divider} className={className}>
        {content}
      </PlainRow>
    )
  }
  return (
    <Row $divider={divider} className={className} {...(htmlFor ? { htmlFor } : {})}>
      {content}
    </Row>
  )
}
