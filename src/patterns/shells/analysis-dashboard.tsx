import React from 'react'
import styled from 'styled-components'
import { StatCard } from '../cards/stat-card'

const Root = styled.div`
  display: grid;
  gap: var(--ig-space-7);
  padding: var(--ig-space-7);
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--ig-space-5);
`

const WidgetGrid = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$columns}, minmax(0, 1fr));
  gap: var(--ig-space-5);
`

const SectionTitle = styled.h3`
  margin: 0 0 var(--ig-space-3);
  font-size: var(--ig-font-size-md);
  font-weight: 600;
  color: var(--ig-color-text-secondary);
`

export interface AnalysisStat {
  label: React.ReactNode
  value: React.ReactNode
  hint?: React.ReactNode
}

export interface AnalysisWidget {
  id: string
  content: React.ReactNode
  span?: number
}

export interface AnalysisDashboardProps {
  stats?: AnalysisStat[]
  /**
   * @deprecated 단일 charts slot. 신규 use case 는 widgets array 권장.
   */
  charts?: React.ReactNode
  tableSlot?: React.ReactNode
  widgets?: AnalysisWidget[]
  widgetColumns?: number
  chartsTitle?: string
  tableTitle?: string
  widgetsTitle?: string
}

export function AnalysisDashboard({
  stats, charts, tableSlot, widgets,
  widgetColumns = 2,
  chartsTitle = 'Charts', tableTitle = 'Breakdown', widgetsTitle,
}: AnalysisDashboardProps) {
  return (
    <Root>
      {stats && stats.length > 0 ? (
        <StatsGrid>
          {stats.map((s, i) => (
            <StatCard key={i} label={s.label} value={s.value} hint={s.hint} />
          ))}
        </StatsGrid>
      ) : null}
      {widgets && widgets.length > 0 ? (
        <section>
          {widgetsTitle ? <SectionTitle>{widgetsTitle}</SectionTitle> : null}
          <WidgetGrid $columns={widgetColumns}>{widgets.map((w) => (
            <React.Fragment key={w.id}>{w.content}</React.Fragment>
          ))}</WidgetGrid>
        </section>
      ) : null}
      {charts ? (
        <section>
          <SectionTitle>{chartsTitle}</SectionTitle>
          {charts}
        </section>
      ) : null}
      {tableSlot ? (
        <section>
          <SectionTitle>{tableTitle}</SectionTitle>
          {tableSlot}
        </section>
      ) : null}
    </Root>
  )
}
