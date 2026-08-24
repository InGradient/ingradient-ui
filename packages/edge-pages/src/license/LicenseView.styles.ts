import styled from 'styled-components'

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
  gap: var(--ig-space-11);
  padding: var(--ig-space-13);
  background: var(--ig-color-bg-canvas);
  overflow-y: auto;
  box-sizing: border-box;
`

export const LangCorner = styled.div`
  position: fixed;
  top: var(--ig-control-height-xl);
  right: var(--ig-space-7);
  z-index: var(--ig-z-sticky);
  display: flex;
  gap: var(--ig-space-3);
  align-items: center;
`

export const FingerprintBox = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  padding: var(--ig-space-4) var(--ig-space-5);
  border-radius: var(--ig-radius-xs);
  border: var(--ig-border-1px) solid var(--ig-color-white-12);
  background: var(--ig-color-white-04);
`

export const FingerprintText = styled.span`
  flex: 1;
  font-family: var(--ig-font-mono);
  font-size: var(--ig-font-size-lg);
  font-weight: var(--ig-font-weight-bold);
  letter-spacing: var(--ig-letter-spacing-widest);
  color: var(--ig-color-accent-soft);
`

export const CopyBtn = styled.button`
  height: var(--ig-control-height-xs);
  padding: 0 var(--ig-space-4);
  border-radius: var(--ig-radius-xs);
  border: none;
  background: var(--ig-color-selection-bg);
  color: var(--ig-color-accent-soft);
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-semibold);
  cursor: pointer;
  transition: background var(--ig-motion-swift);
  &:hover {
    background: var(--ig-color-blue-tint-25);
  }
`

export const HintBox = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  padding: var(--ig-space-5);
  border-radius: var(--ig-radius-xs);
  background: var(--ig-color-blue-tint-06);
  border: var(--ig-border-1px) solid var(--ig-color-selection-bg);
  line-height: var(--ig-line-height-loose);
`