import React from 'react'
import styled from 'styled-components'
import { space, type Space } from '../shared'
import { surfaceCard, surfacePanel, surfaceRaised } from '../styles/surfaces'

const SurfaceRoot = styled.div<{ $elevation?: 'panel' | 'raised' | 'card'; $radius?: Space }>`
  ${(p) => (p.$elevation === 'raised' ? surfaceRaised : p.$elevation === 'card' ? surfaceCard : surfacePanel)}
  border-radius: ${(p) => space(p.$radius) ?? '20px'};
`

export function Surface({
  elevation = 'panel',
  radius,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { elevation?: 'panel' | 'raised' | 'card'; radius?: Space }) {
  return <SurfaceRoot $elevation={elevation} $radius={radius} {...props} />
}
