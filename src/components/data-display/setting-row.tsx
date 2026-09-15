import React from 'react'
import styled from 'styled-components'

/**
 * 설정 화면의 기본 행 — 왼쪽에 이름(+설명), 오른쪽에 컨트롤 하나.
 *
 * KeyValueRow 는 읽기 전용 값을 보여주는 행이고, 이쪽은 조작하는 행이다.
 * 설명은 왜 이 설정이 있는지를 한 줄로 알려주는 자리라, 없으면 이름만 남는다.
 */
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-4);
`

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-1);
  min-width: 0;
`

const Label = styled.span`
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-xs);
`

const Description = styled.span`
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-2xs);
`

export interface SettingRowProps {
  label: React.ReactNode
  description?: React.ReactNode
  /** 오른쪽 컨트롤 — Switch · Slider · Button 등. */
  control?: React.ReactNode
  className?: string
  children?: React.ReactNode
  'data-ig-component'?: string
  'data-ig-label'?: string
  'data-ig-slot'?: string
}

export function SettingRow({
  label,
  description,
  control,
  className,
  children,
  'data-ig-component': componentHint,
  'data-ig-label': componentLabel,
  'data-ig-slot': slotHint,
}: SettingRowProps) {
  const componentName = 'SettingRow'
  const slotName = slotHint ?? (componentHint && componentHint !== componentName ? componentHint : undefined)
  return (
    <Row
      className={className}
      data-ig-component={componentName}
      data-ig-layer="components"
      data-ig-slot={slotName}
      data-ig-kind="setting-row"
      data-ig-label={componentLabel ?? (typeof label === 'string' ? label : undefined)}
    >
      <Text>
        <Label>{label}</Label>
        {description != null && <Description>{description}</Description>}
      </Text>
      {control ?? children}
    </Row>
  )
}
