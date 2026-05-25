import React from 'react'
import styled from 'styled-components'
import { Text } from '../../primitives'
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

const SECTION_TITLE_STYLE = { marginBottom: 'var(--ig-space-3)' }

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
          {widgetsTitle ? <Text as="h3" tone="secondary" size="var(--ig-font-size-md)" weight={600} style={SECTION_TITLE_STYLE}>{widgetsTitle}</Text> : null}
          <WidgetGrid $columns={widgetColumns}>{widgets.map((w) => (
            <React.Fragment key={w.id}>{w.content}</React.Fragment>
          ))}</WidgetGrid>
        </section>
      ) : null}
      {charts ? (
        <section>
          <Text as="h3" tone="secondary" size="var(--ig-font-size-md)" weight={600} style={SECTION_TITLE_STYLE}>{chartsTitle}</Text>
          {charts}
        </section>
      ) : null}
      {tableSlot ? (
        <section>
          <Text as="h3" tone="secondary" size="var(--ig-font-size-md)" weight={600} style={SECTION_TITLE_STYLE}>{tableTitle}</Text>
          {tableSlot}
        </section>
      ) : null}
    </Root>
  )
}
