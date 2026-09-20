import type { HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'

/**
 * 아래 내용을 가리고 그 위에 무언가를 세우는 층.
 *
 * `OverlayLayer` 는 포인터를 통과시켜 이미지 위에 도구를 얹는 용도이고, 이쪽은 반대다 —
 * 진행 중이거나 조작이 불가능한 상태를 덮어 **아래를 못 누르게** 한다.
 * 부모가 `position: relative` 여야 한다.
 */
const Root = styled.div`
  position: absolute;
  inset: 0;
  z-index: var(--ig-z-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ig-color-modal-backdrop);
`

export interface ScrimProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  'data-ig-component'?: string
  'data-ig-slot'?: string
}

export function Scrim({
  children,
  'data-ig-component': componentHint,
  'data-ig-slot': slotHint,
  ...rest
}: ScrimProps) {
  const componentName = 'Scrim'
  const slotName = slotHint ?? (componentHint && componentHint !== componentName ? componentHint : undefined)
  return (
    <Root
      data-ig-component={componentName}
      data-ig-layer="components"
      data-ig-slot={slotName}
      data-ig-kind="scrim"
      {...rest}
    >
      {children}
    </Root>
  )
}
