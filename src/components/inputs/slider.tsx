import React from 'react'
import styled from 'styled-components'

/**
 * 범위 입력. 값이 연속적이고 대략적이면 슬라이더가 맞다 —
 * 정확한 숫자를 입력해야 하면 NumberField 를 쓴다.
 *
 * 값 표시는 소비자가 정한다(% · ms · 배율 등 단위가 화면마다 다르다). `valueLabel` 을
 * 주면 오른쪽에 폭 고정으로 붙어, 자릿수가 바뀌어도 트랙이 흔들리지 않는다.
 */
const Wrap = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-3);
  flex-shrink: 0;
`

const Track = styled.input`
  width: var(--ig-popup-3xs, 140px);
  accent-color: var(--ig-color-accent);
  cursor: pointer;

  &:focus-visible {
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-space-2px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: var(--ig-opacity-disabled);
  }
`

/** 폭 고정 — 자릿수가 바뀔 때 트랙이 흔들리지 않게. */
const ValueLabel = styled.span`
  min-width: var(--ig-icon-4xl, 38px);
  text-align: right;
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-2xs);
  font-variant-numeric: tabular-nums;
`

export const Slider = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    /** 트랙 오른쪽에 붙는 현재 값. 단위는 소비자가 붙인다. */
    valueLabel?: React.ReactNode
    'data-ig-component'?: string
    'data-ig-label'?: string
    'data-ig-slot'?: string
  }
>(function Slider({
  valueLabel,
  className,
  'data-ig-component': componentHint,
  'data-ig-label': componentLabel,
  'data-ig-slot': slotHint,
  ...props
}, ref) {
  const componentName = 'Slider'
  const slotName = slotHint ?? (componentHint && componentHint !== componentName ? componentHint : undefined)
  return (
    <Wrap
      className={className}
      data-ig-component={componentName}
      data-ig-layer="components"
      data-ig-slot={slotName}
      data-ig-kind="slider"
      data-ig-label={componentLabel ?? props['aria-label']}
    >
      <Track ref={ref} type="range" {...props} />
      {valueLabel != null && <ValueLabel>{valueLabel}</ValueLabel>}
    </Wrap>
  )
})
