import styled from 'styled-components'
import { withSurfaceDepth } from '@ingradient/ui/primitives'

/**
 * Edge license screen domain-specific styles.
 * Layout (Stack) and typography (H1/Text) use primitives directly.
 */

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  gap: var(--ig-spacing-24);
  padding: var(--ig-spacing-32);
  background: var(--ig-color-bg-canvas);
  overflow-y: auto;
  box-sizing: border-box;
`

export const LangCorner = styled.div`
  position: fixed;
  top: var(--ig-control-height-xl);
  right: var(--ig-spacing-16);
  z-index: var(--ig-z-sticky);
  display: flex;
  gap: var(--ig-spacing-8);
  align-items: center;
`

const FingerprintBoxBase = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-spacing-8);
  padding: var(--ig-spacing-8) var(--ig-spacing-12);
  border-radius: var(--ig-radius-xs);
  border: var(--ig-border-1px) solid var(--ig-color-white-12);
  background: var(--ig-color-white-04);
`
export const FingerprintBox = withSurfaceDepth(FingerprintBoxBase, { displayName: 'FingerprintBox' })

export const FingerprintText = styled.span`
  flex: 1;
  font-family: var(--ig-font-mono);
  font-size: var(--ig-text-title-sm);
  font-weight: var(--ig-font-weight-bold);
  letter-spacing: var(--ig-letter-spacing-widest);
  color: var(--ig-color-accent-soft);
`

const HintBoxBase = styled.div`
  font-size: var(--ig-text-caption);
  color: var(--ig-color-text-muted);
  padding: var(--ig-spacing-12);
  border-radius: var(--ig-radius-xs);
  background: var(--ig-color-blue-tint-06);
  border: var(--ig-border-1px) solid var(--ig-color-selection-bg);
  line-height: var(--ig-line-height-loose);
`
export const HintBox = withSurfaceDepth(HintBoxBase, { displayName: 'HintBox' })
