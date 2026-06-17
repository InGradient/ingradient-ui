import styled from 'styled-components'
import { surfaceRaised } from '../../primitives'

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: var(--ig-color-modal-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--ig-z-modal);
  padding: var(--ig-space-11);
`

export const ModalCard = styled.div`
  ${surfaceRaised}
  width: min(var(--ig-popup-3xl), 100%);
  max-height: calc(100vh - var(--ig-control-height-xl));
  @supports (height: 1dvh) { max-height: calc(100dvh - var(--ig-control-height-xl)); }
  overflow: hidden;
  border-radius: var(--ig-radius-4xl);
  display: flex;
  flex-direction: column;
`

export const CompactModalCard = styled(ModalCard)`
  width: auto;
  min-width: var(--ig-popup-md);
  max-width: min(var(--ig-popup-2xl), calc(100vw - var(--ig-control-height-xl)));
  padding: var(--ig-space-9);
  border-radius: var(--ig-radius-lg);
`

export const ModalHeader = styled.div`
  padding: var(--ig-space-9) var(--ig-space-10) var(--ig-space-7);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-7);
  flex-wrap: wrap;
  flex-shrink: 0;
`

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: var(--ig-font-size-3xl);
  font-weight: var(--ig-font-weight-bold);
`

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--ig-space-3);
`

export const Drawer = styled.aside<{ $side?: 'left' | 'right' }>`
  ${surfaceRaised}
  position: fixed;
  top: 0;
  bottom: 0;
  ${(p) => (p.$side === 'left' ? 'left: 0;' : 'right: 0;')}
  width: min(var(--ig-popup-2xl-narrow), 100vw);
  z-index: var(--ig-z-drawer);
  padding: var(--ig-space-9);
  border-radius: 0;
`
