import React from 'react'
import styled, { css } from 'styled-components'
import { surfaceCard, surfacePanel, surfaceRaised } from '../../primitives'

type Elevation = 'panel' | 'card' | 'raised'

const surfaceMap = {
  panel: surfacePanel,
  card: surfaceCard,
  raised: surfaceRaised,
} as const

type Border = 'default' | 'strong'
type Tone = 'default' | 'danger'

const CardRoot = styled.div<{
  $elevation: Elevation
  $radius: string
  $padding: string
  $overflow: 'visible' | 'hidden'
  $flat: boolean
  $border: Border
  $tone: Tone
}>`
  ${(p) => surfaceMap[p.$elevation]}
  border-radius: ${(p) => p.$radius};
  padding: ${(p) => p.$padding};
  overflow: ${(p) => p.$overflow};
  min-width: 0;
  ${(p) => p.$border === 'strong' && css`
    border-color: var(--ig-color-border-strong);
  `}
  ${(p) => p.$tone === 'danger' && css`
    background: var(--ig-color-alert-danger-bg);
    border-color: var(--ig-color-alert-danger-border);
  `}
  ${(p) => p.$flat && css`
    box-shadow: none;
  `}
`

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: Elevation
  radius?: string
  padding?: string
  overflow?: 'visible' | 'hidden'
  /** box-shadow 제거 (flat surface) */
  flat?: boolean
  /** 테두리 강조 — surface 기본(subtle) 대신 border-strong */
  border?: Border
  /** danger alert 카드 — bg/border 를 alert-danger 토큰으로 */
  tone?: Tone
  children: React.ReactNode
}

export function Card({
  elevation = 'panel',
  radius = 'var(--ig-radius-lg)',
  padding = 'var(--ig-space-6)',
  overflow = 'visible',
  flat = false,
  border = 'default',
  tone = 'default',
  children,
  ...rest
}: CardProps) {
  return (
    <CardRoot
      $elevation={elevation}
      $radius={radius}
      $padding={padding}
      $overflow={overflow}
      $flat={flat}
      $border={border}
      $tone={tone}
      {...rest}
    >
      {children}
    </CardRoot>
  )
}
