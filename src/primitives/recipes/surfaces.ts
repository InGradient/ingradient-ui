import { css } from 'styled-components'

export const surfacePanel = css`
  background: var(--ig-color-surface-panel);
  border: 1px solid var(--ig-color-border-subtle);
  box-shadow: var(--ig-shadow-panel);
`

export const surfaceRaised = css`
  background: var(--ig-color-surface-raised);
  border: 1px solid var(--ig-color-border-subtle);
  box-shadow: var(--ig-shadow-floating);
`

export const surfaceCard = css`
  background: linear-gradient(180deg, var(--ig-color-surface-card-a) 0%, var(--ig-color-surface-card-b) 100%);
  border: 1px solid var(--ig-color-border-subtle);
  box-shadow: var(--ig-shadow-panel);
`

export const surfaceRounded = css`
  ${surfacePanel}
  border-radius: var(--ig-radius-4xl);
  overflow: hidden;
`
