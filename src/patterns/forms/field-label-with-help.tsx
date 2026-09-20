import type { ReactNode } from 'react'
import styled from 'styled-components'

import { HelpCircleIcon } from '../../components/icons'
import { Tooltip } from '../../components/overlays/tooltip'
import { FieldLabel } from '../page/page-shell'

/**
 * 필드 이름 옆에 `?` 도움말을 붙인다.
 *
 * 설명이 필요한 설정은 대부분 "왜 이 값을 만지는가" 가 한 줄이면 끝난다 — 그걸 위해
 * 화면마다 라벨 행을 새로 만들지 않도록 여기에 둔다.
 */
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
`

const HelpTrigger = styled.span`
  display: inline-flex;
  cursor: help;
  opacity: var(--ig-opacity-muted);
`

export interface FieldLabelWithHelpProps {
  label: ReactNode
  /** 없으면 `?` 가 붙지 않는다. */
  help?: ReactNode
  htmlFor?: string
  className?: string
}

export function FieldLabelWithHelp({ label, help, htmlFor, className }: FieldLabelWithHelpProps) {
  return (
    <Row className={className} data-ig-component="FieldLabelWithHelp" data-ig-layer="patterns">
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {help != null && (
        <Tooltip content={help}>
          <HelpTrigger>
            <HelpCircleIcon size={12} />
          </HelpTrigger>
        </Tooltip>
      )}
    </Row>
  )
}
