import React from 'react'
import styled from 'styled-components'

const SplitLayoutRoot = styled.div<{
  $sidebarWidth: string
  $inspectorWidth: string
  $hasSidebar: boolean
  $hasInspector: boolean
}>`
  display: grid;
  grid-template-columns: ${(p) =>
    `${p.$hasSidebar ? `minmax(0, ${p.$sidebarWidth}) ` : ''}minmax(0, 1fr)${p.$hasInspector ? ` minmax(0, ${p.$inspectorWidth})` : ''}`};
  gap: 16px;
  min-width: 0;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

export function SplitLayout({
  sidebar,
  content,
  inspector,
  sidebarWidth = '260px',
  inspectorWidth = '320px',
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
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
`

export const ListDetailLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  gap: 16px;
  min-width: 0;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

export const SettingsShell = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  gap: 16px;
  min-width: 0;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`

export const SplitPanelShell = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  gap: 16px;
  min-width: 0;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

export const InspectorLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
  gap: 16px;
  min-width: 0;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`
