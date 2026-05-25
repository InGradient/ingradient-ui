import React from 'react'
import { Grid, Stack, Text } from '../../primitives'
import { StatCard } from '../cards/stat-card'

const ROOT_STYLE = { padding: 'var(--ig-space-7)' }
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
    <Stack gap={7} style={ROOT_STYLE}>
      {stats && stats.length > 0 ? (
        <Grid gap={5} minItemWidth={180}>
          {stats.map((s, i) => (
            <StatCard key={i} label={s.label} value={s.value} hint={s.hint} />
          ))}
        </Grid>
      ) : null}
      {widgets && widgets.length > 0 ? (
        <Stack as="section" gap={0}>
          {widgetsTitle ? <Text as="h3" tone="secondary" size="var(--ig-font-size-md)" weight={600} style={SECTION_TITLE_STYLE}>{widgetsTitle}</Text> : null}
          <Grid gap={5} columns={`repeat(${widgetColumns}, minmax(0, 1fr))`}>
            {widgets.map((w) => (
              <React.Fragment key={w.id}>{w.content}</React.Fragment>
            ))}
          </Grid>
        </Stack>
      ) : null}
      {charts ? (
        <Stack as="section" gap={0}>
          <Text as="h3" tone="secondary" size="var(--ig-font-size-md)" weight={600} style={SECTION_TITLE_STYLE}>{chartsTitle}</Text>
          {charts}
        </Stack>
      ) : null}
      {tableSlot ? (
        <Stack as="section" gap={0}>
          <Text as="h3" tone="secondary" size="var(--ig-font-size-md)" weight={600} style={SECTION_TITLE_STYLE}>{tableTitle}</Text>
          {tableSlot}
        </Stack>
      ) : null}
    </Stack>
  )
}
