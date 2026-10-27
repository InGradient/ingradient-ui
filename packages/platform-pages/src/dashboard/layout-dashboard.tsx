import styled from 'styled-components'
import { Fragment, type ReactNode } from 'react'
import { Grid, Stack, Text } from '@ingradient/ui/primitives'
import { StatCard } from '@ingradient/ui/patterns'

const RootBox = styled(Stack)`
  padding: var(--ig-spacing-16);
`
const SectionTitleBox = styled(Text)`
  margin-bottom: var(--ig-spacing-8);
`

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
    <RootBox gap="var(--ig-spacing-16)">
      {stats && stats.length > 0 ? (
        <Grid gap="var(--ig-spacing-12)" minItemWidth={180}>
          {stats.map((s, i) => (
            <StatCard key={i} label={s.label} value={s.value} hint={s.hint} />
          ))}
        </Grid>
      ) : null}
      {widgets && widgets.length > 0 ? (
        <Stack as="section" gap="var(--ig-space-0)">
          {widgetsTitle ? <SectionTitleBox forwardedAs="h3" tone="secondary" size="var(--ig-text-body)" weight="semibold">{widgetsTitle}</SectionTitleBox> : null}
          <Grid gap="var(--ig-spacing-12)" columns={`repeat(${widgetColumns}, minmax(0, 1fr))`}>
            {widgets.map((w) => (
              <Fragment key={w.id}>{w.content}</Fragment>
            ))}
          </Grid>
        </Stack>
      ) : null}
      {charts ? (
        <Stack as="section" gap="var(--ig-space-0)">
          <SectionTitleBox forwardedAs="h3" tone="secondary" size="var(--ig-text-body)" weight="semibold">{chartsTitle}</SectionTitleBox>
          {charts}
        </Stack>
      ) : null}
      {tableSlot ? (
        <Stack as="section" gap="var(--ig-space-0)">
          <SectionTitleBox forwardedAs="h3" tone="secondary" size="var(--ig-text-body)" weight="semibold">{tableTitle}</SectionTitleBox>
          {tableSlot}
        </Stack>
      ) : null}
    </RootBox>
  )
}
