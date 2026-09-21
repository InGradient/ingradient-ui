import { cloneElement, isValidElement, useId, type ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Text } from '../../primitives'

/** 촘촘한 기본형. 설정 탭 안쪽처럼 행이 여럿 이어질 때 쓴다. */
const rowBase = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-4);
  padding: 0;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-xs);
  &:last-child {
    border-bottom: 0;
  }
`

/** 구분선형. 항목 사이를 선으로 끊고 글자도 한 단계 키운다. */
const rowDivider = css`
  padding: var(--ig-space-4) 0;
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-strong);
  font-size: var(--ig-font-size-md);
`

const Row = styled.label<{ $divider: boolean }>`
  ${rowBase}
  ${(p) => p.$divider && rowDivider}
`

const PlainRow = styled.div<{ $divider: boolean }>`
  ${rowBase}
  flex-wrap: wrap;
  ${(p) => p.$divider && rowDivider}
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
  /** Single control forwarding id and aria-describedby to its native input.
   * With asLabel=true, a sibling label targets htmlFor, its existing id, or a generated id.
   * Composite/non-input controls should use asLabel=false and own their naming.
   */
  control?: ReactNode
  /** Legacy custom composition; caller owns valid label/control markup. */
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
  const generatedId = useId()
  // The control slot must forward id/aria-describedby to its native input.
  // Keep legacy children composition and explicit asLabel=false opt-out intact.
  if (asLabel && children == null && isValidElement<{ id?: string; 'aria-describedby'?: string }>(control)) {
    const controlId = htmlFor ?? control.props.id ?? `${generatedId}-control`
    const descriptionId = `${generatedId}-description`
    return (
      <Row as="div" $divider={divider} className={className}>
        <TextBlock>
          <label htmlFor={controlId}>{label}</label>
          {description != null && <Text id={descriptionId} as="span" tone="muted" size="var(--ig-font-size-2xs)">{description}</Text>}
        </TextBlock>
        {cloneElement(control, {
          id: controlId,
          'aria-describedby': [control.props['aria-describedby'], description != null ? descriptionId : undefined].filter(Boolean).join(' ') || undefined,
        })}
      </Row>
    )
  }
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
