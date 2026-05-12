import { css } from 'styled-components'

export const appShell = css`
  display: flex;
  flex-direction: column;
  min-height: 0;
  background:
    radial-gradient(circle at top left, var(--ig-color-bg-radial-a), transparent 32%),
    radial-gradient(circle at top right, var(--ig-color-bg-radial-b), transparent 28%),
    var(--ig-color-bg-canvas);
  color: var(--ig-color-text-primary);
`

export const headerSurface = css`
  background: var(--ig-color-surface-header);
  border-bottom: 1px solid var(--ig-color-border-subtle);
  backdrop-filter: blur(14px);
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
