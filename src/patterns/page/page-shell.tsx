import styled from 'styled-components'
import { surfacePanel } from '../../primitives'
import { appShell, pageContentLayout, pageHeaderSurface } from '../shared/surfaces'
import { media } from '../../tokens/foundations/breakpoints'

export const AppShell = styled.div`
  ${appShell}
  height: 100%;
  min-height: 0;
`

export const PageHeader = styled.header`
  ${pageHeaderSurface}
  flex-shrink: 0;

  ${media.md} {
    padding: var(--ig-space-6) var(--ig-space-7) var(--ig-space-5);
  }
`

export const PageHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-7);
  flex-wrap: wrap;
`

export const PageTitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
  min-width: 0;
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: var(--ig-font-size-2xl);
  font-weight: 700;
  letter-spacing: -0.02em;

  ${media.md} {
    font-size: var(--ig-font-size-xl);
  }
`

export const PageSubtitle = styled.p`
  margin: 0;
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-muted);
`

export const PageContent = styled.div`
  ${pageContentLayout}
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-8);

  ${media.md} {
    padding: var(--ig-space-5) var(--ig-space-6) var(--ig-space-7);
    gap: var(--ig-space-5);
  }
`

export const Panel = styled.section`
  ${surfacePanel}
  border-radius: var(--ig-radius-xl);
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const PanelHeader = styled.div`
  padding: var(--ig-space-7) var(--ig-space-8) var(--ig-space-5);
  border-bottom: 1px solid var(--ig-color-border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-5);
`

export const PanelTitle = styled.h2`
  margin: 0;
  font-size: var(--ig-font-size-md);
  font-weight: 700;
`

export const PanelHint = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
`

export const SectionTitle = styled.h3`
  margin: 0 0 var(--ig-space-5);
  font-size: var(--ig-font-size-lg);
  font-weight: 600;
  color: var(--ig-color-text-primary);
`

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-5);
  flex-wrap: wrap;
  padding: var(--ig-space-6) var(--ig-space-7);
  border-radius: var(--ig-radius-lg);
  border: 1px solid var(--ig-color-border-subtle);
  background: var(--ig-color-toolbar-surface);
`

export const FilterBar = styled(Toolbar)`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) auto;
  align-items: center;

  ${media.md} {
    grid-template-columns: 1fr;
  }
`

export const FormSection = styled(Panel)`
  padding: var(--ig-space-8);
  gap: var(--ig-space-6);
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
