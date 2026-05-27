import styled from 'styled-components'
import { surfacePanel, surfaceRaised } from '../../primitives'
import { headerSurface } from '../shared/surfaces'

export const SidebarNav = styled.nav`
  ${surfacePanel}
  border-radius: var(--ig-radius-xl);
  padding: var(--ig-space-7);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
`

export const AppSidebar = styled.aside<{ $width?: number | string }>`
  ${surfacePanel}
  width: ${(p) => (typeof p.$width === 'number' ? `${p.$width}px` : p.$width ?? '280px')};
  min-width: 0;
  min-height: 0;
  border-radius: var(--ig-radius-2xl);
  padding: var(--ig-space-8) var(--ig-space-7);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-7);
`

export const SidebarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

export const SidebarFooter = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

export const TopBar = styled.div`
  ${headerSurface}
  padding: var(--ig-space-6) var(--ig-space-8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-5);
`

export const MobileNavDrawer = styled.aside<{ $open?: boolean }>`
  ${surfaceRaised}
  position: fixed;
  inset: 0 auto 0 0;
  width: min(320px, calc(100vw - 24px));
  padding: var(--ig-space-8) var(--ig-space-7);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-6);
  transform: translateX(${(p) => (p.$open === false ? '-100%' : '0')});
  transition: transform 0.2s ease;
  z-index: var(--ig-z-drawer);
`
