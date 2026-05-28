import React from 'react'
import styled from 'styled-components'
import { surfaceRaised } from '../../primitives'

const Card = styled.div`
  ${surfaceRaised}
  border-radius: var(--ig-radius-md);
  padding: var(--ig-space-4) var(--ig-space-5);
  min-width: var(--ig-popup-2xs);
`

export interface TooltipCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function TooltipCard({ children, ...rest }: TooltipCardProps) {
  return <Card {...rest}>{children}</Card>
}
