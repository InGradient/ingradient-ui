import styled from 'styled-components'

/**
 * Edge auth screen shared layout primitives.
 * Domain-specific positioning and surface styling that doesn't map to
 * generic @ingradient/ui primitives is kept here.
 * Layout (Stack/Inline) and typography (H1/Text) use primitives directly.
 */

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var(--ig-space-11);
  padding: var(--ig-space-13);
  background: var(--ig-color-bg-canvas);
  position: relative;
`

export const LangCorner = styled.div`
  position: absolute;
  top: var(--ig-space-7);
  right: var(--ig-space-7);
  display: flex;
  gap: var(--ig-space-3);
  align-items: center;
`

export const PackageInfo = styled.div`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-muted);
  text-align: center;
  padding: var(--ig-space-4);
  background: var(--ig-color-white-04);
  border-radius: var(--ig-radius-xs);
  border: var(--ig-border-1px) solid var(--ig-color-white-07);
`

export const Divider = styled.div`
  height: var(--ig-space-1px);
  background: var(--ig-color-white-08);
`