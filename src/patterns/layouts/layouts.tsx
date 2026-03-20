import React from 'react'
import styled from 'styled-components'

export function SplitLayout({
  sidebar,
  content,
  inspector,
}: {
  sidebar?: React.ReactNode
  content: React.ReactNode
  inspector?: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `${sidebar ? '260px ' : ''}minmax(0,1fr)${inspector ? ' 320px' : ''}`,
        gap: 16,
        minWidth: 0,
      }}
    >
      {sidebar}
      {content}
      {inspector}
    </div>
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
