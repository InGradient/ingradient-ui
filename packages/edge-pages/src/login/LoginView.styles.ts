import styled from 'styled-components'
import { withSurfaceDepth } from '@ingradient/ui/primitives'

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
  gap: var(--ig-spacing-24);
  padding: var(--ig-spacing-32);
  background: var(--ig-color-bg-canvas);
  position: relative;
`

export const LangCorner = styled.div`
  position: absolute;
  top: var(--ig-spacing-16);
  right: var(--ig-spacing-16);
  display: flex;
  gap: var(--ig-spacing-8);
  align-items: center;
`

const PackageInfoBase = styled.div`
  font-size: var(--ig-text-body-sm);
  color: var(--ig-color-text-muted);
  text-align: center;
  padding: calc(var(--ig-spacing-8) - var(--ig-border-1px));
  background: var(--ig-color-white-04);
  border-radius: var(--ig-radius-xs);
  border: var(--ig-border-1px) solid var(--ig-color-white-07);
`
export const PackageInfo = withSurfaceDepth(PackageInfoBase, { displayName: 'PackageInfo' })

export const Divider = styled.div`
  height: var(--ig-space-1px);
  background: var(--ig-color-white-08);
`
