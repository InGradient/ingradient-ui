import { css } from 'styled-components'

/**
 * Padding for a box with a 1px border on every side: each non-zero part loses the border width,
 * so the outer size stays on the 4px grid and content keeps its token distance from the outer edge.
 * Accepts CSS shorthand (1-4 parts; parts may be var() or calc()).
 */
export function paddingInsideBorder(padding: string): string {
  const parts: string[] = []
  let depth = 0, cur = ''
  for (const ch of padding.trim()) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (/\s/.test(ch) && depth === 0) { if (cur) parts.push(cur); cur = '' } else cur += ch
  }
  if (cur) parts.push(cur)
  return parts.map((v) => (/^0(px)?$/.test(v) ? v : `calc(${v} - var(--ig-border-1px))`)).join(' ')
}

export const surfacePanel = css`
  background: var(--ig-color-surface-panel);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  box-shadow: var(--ig-shadow-panel);
`

export const surfaceRaised = css`
  background: var(--ig-color-surface-raised);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  box-shadow: var(--ig-shadow-floating);
`

export const surfaceCard = css`
  background: linear-gradient(180deg, var(--ig-color-surface-card-a) 0%, var(--ig-color-surface-card-b) 100%);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  box-shadow: var(--ig-shadow-panel);
`

export const surfaceRounded = css`
  ${surfacePanel}
  border-radius: var(--ig-radius-4xl);
  overflow: hidden;
`
