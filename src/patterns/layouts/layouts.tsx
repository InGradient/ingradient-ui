import React from 'react'
import styled from 'styled-components'
import { media } from '../../tokens/core/breakpoints'

const SplitLayoutRoot = styled.div<{
  $sidebarWidth: string
  $inspectorWidth: string
  $hasSidebar: boolean
  $hasInspector: boolean
}>`
  display: grid;
  grid-template-columns: ${(p) =>
    `${p.$hasSidebar ? `minmax(0, ${p.$sidebarWidth}) ` : ''}minmax(0, 1fr)${p.$hasInspector ? ` minmax(0, ${p.$inspectorWidth})` : ''}`};
  gap: var(--ig-space-7);
  min-width: 0;

  ${media.lg} {
    grid-template-columns: 1fr;
  }
`

export function SplitLayout({
  sidebar,
  content,
  inspector,
  sidebarWidth = 'var(--ig-popup-page-card-min)',
  inspectorWidth = 'var(--ig-popup-md)',
}: {
  sidebar?: React.ReactNode
  content: React.ReactNode
  inspector?: React.ReactNode
  sidebarWidth?: string
  inspectorWidth?: string
}) {
  return (
    <SplitLayoutRoot
      $hasSidebar={!!sidebar}
      $hasInspector={!!inspector}
      $sidebarWidth={sidebarWidth}
      $inspectorWidth={inspectorWidth}
    >
      {sidebar}
      {content}
      {inspector}
    </SplitLayoutRoot>
  )
}

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--ig-popup-page-card-min), 1fr));
  gap: var(--ig-space-7);
`

export const ListDetailLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(var(--ig-popup-sm), var(--ig-popup-lg)) minmax(0, 1fr);
  gap: var(--ig-space-7);
  min-width: 0;

  ${media.lg} {
    grid-template-columns: 1fr;
  }
`

export const SettingsShell = styled.div`
  display: grid;
  grid-template-columns: minmax(var(--ig-popup-xs), var(--ig-popup-sm)) minmax(0, 1fr);
  gap: var(--ig-space-7);
  min-width: 0;

  ${media.lg} {
    grid-template-columns: 1fr;
  }
`

export const InspectorLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(var(--ig-popup-sm), var(--ig-popup-lg));
  gap: var(--ig-space-7);
  min-width: 0;

  ${media.lg} {
    grid-template-columns: 1fr;
  }
`
