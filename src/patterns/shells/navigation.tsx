import styled from 'styled-components'
import { surfacePanel, surfaceRaised } from '../../primitives'
import { headerSurface } from '../shared/surfaces'

export const SidebarNav = styled.nav`
  ${surfacePanel}
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const AppSidebar = styled.aside`
  ${surfacePanel}
  width: 280px;
  min-width: 0;
  min-height: 0;
  border-radius: 24px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const SidebarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const SidebarFooter = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const TopBar = styled.div`
  ${headerSurface}
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const MobileNavDrawer = styled.aside<{ $open?: boolean }>`
  ${surfaceRaised}
  position: fixed;
  inset: 0 auto 0 0;
  width: min(320px, calc(100vw - 24px));
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transform: translateX(${(p) => (p.$open === false ? '-100%' : '0')});
  transition: transform 0.2s ease;
  z-index: 1100;
`
