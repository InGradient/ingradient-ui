import { chartHeights } from '@ingradient/ui'
import { chartColors } from '@ingradient/ui'
import styled from 'styled-components'
import { DashboardCard as Card } from '../dashboard-card'
import { Box, Inline, Text } from '@ingradient/ui/primitives'
import { BarChartCard } from '@ingradient/ui/patterns'
import { Table, type TableColumn } from '@ingradient/ui/components'

const Block = styled.div`
  margin-bottom: var(--ig-spacing-16);
  &:last-child { margin-bottom: 0; }
`

const HeadBox = styled(Inline)`
  margin-bottom: var(--ig-spacing-8);
`
const ChipBox = styled(Text)`
  display: inline-block;
  padding: var(--ig-spacing-2) var(--ig-spacing-8);
  background: var(--ig-color-surface-raised);
  border-radius: var(--ig-radius-2xs);
`
const EmptyBox = styled(Text)`
  margin: 0;
`
const EmptyOffsetBox = styled(Text)`
  margin: 0;
  margin-top: var(--ig-spacing-12);
`
const TableWrapBox = styled(Box)`
  margin-top: var(--ig-spacing-8);
`
const ChartBox = styled.div`
  margin-top: var(--ig-spacing-12);
`

const SOURCE_COLORS = ['var(--ig-color-accent)', chartColors.violet, chartColors.teal, chartColors.amber, chartColors.coral, chartColors.lightBlue, chartColors.lightViolet, chartColors.mint]

export interface DefectCount {
  class_id: string
  name: string
  count: number
}

const DEFECT_COLUMNS: TableColumn<DefectCount>[] = [
  { key: 'name', header: 'Class', render: (item) => item.name },
  { key: 'count', header: 'Count', numeric: true, render: (item) => item.count.toLocaleString() },
]

export interface SourceBreakdownSource {
  source: string
  camera_ip?: string | null
  defect_counts: DefectCount[]
}

export interface SourceBreakdownWidgetProps {
  bySource: SourceBreakdownSource[]
  title?: string
  emptyText?: string
  noDefectText?: string
  className?: string
}

export function SourceBreakdownWidget({
  bySource,
  title = 'Source breakdown',
  emptyText = 'No data by source.',
  noDefectText = 'No defect labels',
  className,
}: SourceBreakdownWidgetProps) {
  return (
    <Card className={className}>
      <HeadBox justify="space-between" gap="var(--ig-spacing-12)">
        <Text size="var(--ig-text-body-sm)" weight="semibold" tone="secondary">{title}</Text>
      </HeadBox>
      {bySource.length === 0 ? (
        <EmptyBox forwardedAs="p" tone="soft" size="var(--ig-text-body)">{emptyText}</EmptyBox>
      ) : (
        bySource.map((source) => {
          const sourceLabel = source.source === 'camera' && source.camera_ip
            ? `Camera ${source.camera_ip}`
            : source.source
          return (
          <Block key={`${source.source}-${source.camera_ip ?? ''}`}>
            <ChipBox size="var(--ig-text-caption)" tone="muted">{sourceLabel}</ChipBox>
            {source.defect_counts.length === 0 ? (
              <EmptyOffsetBox forwardedAs="p" tone="soft" size="var(--ig-text-body)">{noDefectText}</EmptyOffsetBox>
            ) : (
              <TableWrapBox>
                <Table columns={DEFECT_COLUMNS} rows={source.defect_counts} ariaLabel={`${sourceLabel} defect counts`} />
                <ChartBox>
                  <BarChartCard
                    data={source.defect_counts.map((d, i) => ({ name: d.name, count: d.count, color: SOURCE_COLORS[i % SOURCE_COLORS.length] }))}
                    xKey="name"
                    series={[{ key: 'count', label: 'Count' }]}
                    height={chartHeights.sm}
                    getCellColor={(row) => row.color as string}
                  />
                </ChartBox>
              </TableWrapBox>
            )}
          </Block>
          )
        })
      )}
    </Card>
  )
}
