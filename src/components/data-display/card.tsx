import React from 'react'
import styled, { css } from 'styled-components'
import { surfaceCard, surfacePanel, surfaceRaised } from '../../primitives'

type Elevation = 'panel' | 'card' | 'raised'

const surfaceMap = {
  panel: surfacePanel,
  card: surfaceCard,
  raised: surfaceRaised,
} as const

const CardRoot = styled.div<{
  $elevation: Elevation
  $radius: string
  $padding: string
  $overflow: 'visible' | 'hidden'
}>`
  ${(p) => surfaceMap[p.$elevation]}
  border-radius: ${(p) => p.$radius};
  padding: ${(p) => p.$padding};
  overflow: ${(p) => p.$overflow};
  ${css`
    min-width: 0;
  `}
`

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: Elevation
  radius?: string
  padding?: string
  overflow?: 'visible' | 'hidden'
  children: React.ReactNode
}

export function Card({
  elevation = 'panel',
  radius = 'var(--ig-radius-lg)',
  padding = 'var(--ig-space-6)',
  overflow = 'visible',
  children,
  ...rest
}: CardProps) {
  return (
    <CardRoot
      $elevation={elevation}
      $radius={radius}
      $padding={padding}
      $overflow={overflow}
      {...rest}
    >
      {children}
    </CardRoot>
  )
}
