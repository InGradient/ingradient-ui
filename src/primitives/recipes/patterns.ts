import { css } from 'styled-components'

export const appShell = css`
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: var(--ig-color-bg-canvas);
  color: var(--ig-color-text-primary);
`

export const headerSurface = css`
  background: var(--ig-color-surface-header);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  backdrop-filter: var(--ig-blur-lg);
`

export const pageHeaderSurface = css`
  ${headerSurface}
  padding: var(--ig-space-10) var(--ig-space-11) var(--ig-space-8);
`

export const pageContentLayout = css`
  flex: 1;
  min-height: 0;
  padding: var(--ig-space-8) var(--ig-space-11) var(--ig-space-11);
  overflow: hidden;
`
