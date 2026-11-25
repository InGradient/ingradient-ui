import styled from 'styled-components'

/** Covers the detail modal's main area only, so the side panel stays readable behind the question. */
export const ConfirmOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: var(--ig-z-overlay-low);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ig-spacing-20);
  background: var(--ig-color-modal-backdrop);
`
export const ConfirmCard = styled.div`
  width: min(var(--ig-popup-2xl-narrow), 100%);
  padding: var(--ig-spacing-16);
  border-radius: var(--ig-radius-xl);
  background: var(--ig-color-surface-raised);
  border: var(--ig-border-1px) solid var(--ig-color-white-08);
  box-shadow: var(--ig-shadow-popover);
  display: flex;
  flex-direction: column;
  gap: var(--ig-spacing-12);
`
export const ConfirmTitle = styled.h3`
  margin: 0;
  font-size: var(--ig-text-title-sm);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
`
export const ConfirmText = styled.p`
  margin: 0;
  font-size: var(--ig-text-body-sm);
  line-height: var(--ig-text-body-sm-leading);
  color: var(--ig-color-text-muted);
`
export const ConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: var(--ig-spacing-8);
`
export const ConfirmError = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-danger);
`
