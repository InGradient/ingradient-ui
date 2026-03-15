import styled, { css } from 'styled-components'
import { portalPanelSurface } from '@ingradient/ui'

export const portalPageShell = css`
  display: flex;
  flex-direction: column;
  min-height: 0;
  background:
    radial-gradient(circle at top left, var(--portal-bg-radial-a), transparent 32%),
    radial-gradient(circle at top right, var(--portal-bg-radial-b), transparent 28%),
    var(--portal-bg-base);
  color: var(--portal-text-primary);
`

export const portalHeaderSurface = css`
  background: var(--portal-surface-header);
  border-bottom: 1px solid var(--portal-border);
  backdrop-filter: blur(14px);
`

export const portalPageHeader = css`
  ${portalHeaderSurface}
  padding: 22px 24px 18px;
`

export const portalPageContent = css`
  flex: 1;
  min-height: 0;
  padding: 18px 24px 24px;
  overflow: hidden;
`

export const PortalPageShell = styled.div`
  ${portalPageShell}
  height: 100%;
  min-height: 0;
`

export const PortalPageHeader = styled.header`
  ${portalHeaderSurface}
  padding: 22px 24px 18px;
  flex-shrink: 0;
  @media (max-width: 768px) {
    padding: 14px 16px 12px;
  }
`

export const PortalPageHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`

export const PortalPageTitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`

export const PortalPageTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  @media (max-width: 768px) {
    font-size: 20px;
  }
`

export const PortalPageSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: var(--portal-text-muted);
`

export const PortalPageContent = styled.div`
  ${portalPageContent}
  display: flex;
  flex-direction: column;
  gap: 18px;
  @media (max-width: 768px) {
    padding: 12px 14px 16px;
    gap: 12px;
  }
`

export const PortalPanel = styled.section`
  ${portalPanelSurface}
  border-radius: 20px;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const PortalPanelHeader = styled.div`
  padding: 16px 18px 12px;
  border-bottom: 1px solid var(--portal-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const PortalPanelTitle = styled.h2`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
`

export const PortalPanelHint = styled.span`
  font-size: 12px;
  color: var(--portal-text-muted);
`

export const PortalSectionTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--portal-text-primary);
`
