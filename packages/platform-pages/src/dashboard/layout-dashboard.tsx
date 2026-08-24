import { Fragment, type ReactNode } from 'react'
import { Grid, Stack, Text } from '@ingradient/ui/primitives'
import { StatCard } from '@ingradient/ui/patterns'

const ROOT_STYLE = { padding: 'var(--ig-space-7)' }
const SECTION_TITLE_STYLE = { marginBottom: 'var(--ig-space-3)' }

export interface DashboardStat {
  label: ReactNode
  value: ReactNode
  hint?: ReactNode
}

export interface LayoutDashboardWidget {
  id: string
  content: ReactNode
  span?: number
}

export interface LayoutDashboardProps {
  stats?: DashboardStat[]
  /**
   * @deprecated 단일 charts slot. 신규 use case 는 widgets array 권장.
   */
  charts?: ReactNode
  tableSlot?: ReactNode
  widgets?: LayoutDashboardWidget[]
  widgetColumns?: number
  chartsTitle?: string
  tableTitle?: string
  widgetsTitle?: string
}

export function LayoutDashboard({
  stats, charts, tableSlot, widgets,
  widgetColumns = 2,
  chartsTitle = 'Charts', tableTitle = 'Breakdown', widgetsTitle,
}: LayoutDashboardProps) {
  return (
    <Stack gap="var(--ig-space-7)" style={ROOT_STYLE}>
      {stats && stats.length > 0 ? (
        <Grid gap="var(--ig-space-5)" minItemWidth={180}>
          {stats.map((s, i) => (
            <StatCard key={i} label={s.label} value={s.value} hint={s.hint} />
          ))}
        </Grid>
      ) : null}
      {widgets && widgets.length > 0 ? (
        <Stack as="section" gap={0}>
          {widgetsTitle ? <Text as="h3" tone="secondary" size="var(--ig-font-size-md)" weight="semibold" style={SECTION_TITLE_STYLE}>{widgetsTitle}</Text> : null}
          <Grid gap="var(--ig-space-5)" columns={`repeat(${widgetColumns}, minmax(0, 1fr))`}>
            {widgets.map((w) => (
              <Fragment key={w.id}>{w.content}</Fragment>
            ))}
          </Grid>
        </Stack>
      ) : null}
      {charts ? (
        <Stack as="section" gap={0}>
          <Text as="h3" tone="secondary" size="var(--ig-font-size-md)" weight="semibold" style={SECTION_TITLE_STYLE}>{chartsTitle}</Text>
          {charts}
        </Stack>
      ) : null}
      {tableSlot ? (
        <Stack as="section" gap={0}>
          <Text as="h3" tone="secondary" size="var(--ig-font-size-md)" weight="semibold" style={SECTION_TITLE_STYLE}>{tableTitle}</Text>
          {tableSlot}
        </Stack>
      ) : null}
    </Stack>
  )
}
