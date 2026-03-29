export * from '../hooks'
export * from './shared/button-types'
export * from './inputs'
export * from './feedback'
export * from './navigation'
export * from './overlays'
export * from './data-display'
export * from './icons'
export * from './charts'

import styled from 'styled-components'
import { surfaceCard, surfacePanel } from '../primitives'

export const Paper = styled.div`
  ${surfacePanel}
  border-radius: var(--ig-radius-2xl);
`

export const Card = styled.div`
  ${surfaceCard}
  border-radius: var(--ig-radius-2xl);
`

export const Accordion = styled.details`
  ${surfacePanel}
  border-radius: var(--ig-radius-xl);
  overflow: hidden;

  summary {
    cursor: pointer;
    padding: var(--ig-space-6) var(--ig-space-7);
    list-style: none;
    font-weight: 600;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  > div {
    padding: 0 16px 16px;
    color: var(--ig-color-text-muted);
  }
`
