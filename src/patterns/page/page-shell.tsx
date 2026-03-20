import styled from 'styled-components'
import { surfacePanel } from '../../primitives'
import { appShell, pageContentLayout, pageHeaderSurface } from '../shared/surfaces'

export const AppShell = styled.div`
  ${appShell}
  height: 100%;
  min-height: 0;
`

export const PageHeader = styled.header`
  ${pageHeaderSurface}
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 14px 16px 12px;
  }
`

export const PageHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`

export const PageTitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`

export const PageSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: var(--ig-color-text-muted);
`

export const PageContent = styled.div`
  ${pageContentLayout}
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (max-width: 768px) {
    padding: 12px 14px 16px;
    gap: 12px;
  }
`

export const Panel = styled.section`
  ${surfacePanel}
  border-radius: 20px;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const PanelHeader = styled.div`
  padding: 16px 18px 12px;
  border-bottom: 1px solid var(--ig-color-border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const PanelTitle = styled.h2`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
`

export const PanelHint = styled.span`
  font-size: 12px;
  color: var(--ig-color-text-muted);
`

export const SectionTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--ig-color-text-primary);
`

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--ig-color-border-subtle);
  background: var(--ig-color-toolbar-surface);
`

export const FilterBar = styled(Toolbar)`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) auto;
  align-items: center;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

export const FormSection = styled(Panel)`
  padding: 18px;
  gap: 14px;
`

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
  min-width: 0;
`

export const FieldLabel = styled.label`
  font-size: var(--ig-font-size-sm);
  font-weight: 600;
  color: var(--ig-color-text-muted);
`

export const FieldHint = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
`
