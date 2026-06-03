import { chartHeights } from '@ingradient/ui'
import styled from 'styled-components'
import { Box, Inline, Text } from '@ingradient/ui/primitives'
import { BarChartCard } from '@ingradient/ui/patterns'
import { SectionPanel } from '@ingradient/ui/components'

const Card = styled(SectionPanel)`
  background: var(--ig-color-surface-raised);
  border-color: var(--ig-color-border-strong);
  border-radius: var(--ig-radius-xxs);
  padding: var(--ig-space-7) var(--ig-space-9);
  gap: var(--ig-space-5);
`

const Block = styled.div`
  margin-bottom: var(--ig-space-7);
  &:last-child { margin-bottom: 0; }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--ig-font-size-md);
  th, td {
    padding: var(--ig-space-3) var(--ig-space-5);
    text-align: left;
    border-bottom: var(--ig-border-1px) solid var(--ig-color-border-strong);
  }
  th { color: var(--ig-color-text-muted); font-weight: var(--ig-font-weight-medium); }
  td { color: var(--ig-color-text-primary); }
`

const HEAD_STYLE = { marginBottom: 'var(--ig-space-4)' }
const CHIP_STYLE = {
  display: 'inline-block' as const,
  padding: '2px var(--ig-space-3)',
  background: 'var(--ig-color-surface-raised)',
  borderRadius: 'var(--ig-radius-2xs)',
}
const EMPTY_STYLE = { margin: 0 }
const EMPTY_OFFSET_STYLE = { margin: 0, marginTop: 'var(--ig-space-5)' }
const TABLE_WRAP_STYLE = { marginTop: 'var(--ig-space-3)' }
const CHART_STYLE = { marginTop: 'var(--ig-space-5)' }

const SOURCE_COLORS = ['var(--ig-color-accent)', '#6c5ce7', '#00b894', '#fdcb6e', '#e17055', '#74b9ff', '#a29bfe', '#55efc4']

export interface DefectCount {
  class_id: string
  name: string
  count: number
}

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
      <Inline justify="space-between" gap={5} style={HEAD_STYLE}>
        <Text size="var(--ig-font-size-sm)" weight={600} tone="secondary">{title}</Text>
      </Inline>
      {bySource.length === 0 ? (
        <Text as="p" tone="soft" size="var(--ig-font-size-md)" style={EMPTY_STYLE}>{emptyText}</Text>
      ) : (
        bySource.map((source) => (
          <Block key={`${source.source}-${source.camera_ip ?? ''}`}>
            <Text size="var(--ig-font-size-xs)" tone="muted" style={CHIP_STYLE}>{source.source === 'camera' && source.camera_ip ? `Camera ${source.camera_ip}` : source.source}</Text>
            {source.defect_counts.length === 0 ? (
              <Text as="p" tone="soft" size="var(--ig-font-size-md)" style={EMPTY_OFFSET_STYLE}>{noDefectText}</Text>
            ) : (
              <Box style={TABLE_WRAP_STYLE}>
                <Table>
                  <thead><tr><th>Class</th><th>Count</th></tr></thead>
                  <tbody>
                    {source.defect_counts.map((item) => (
                      <tr key={item.class_id}>
                        <td>{item.name}</td>
                        <td>{item.count.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div style={CHART_STYLE}>
                  <BarChartCard
                    data={source.defect_counts.map((d, i) => ({ name: d.name, count: d.count, color: SOURCE_COLORS[i % SOURCE_COLORS.length] }))}
                    xKey="name"
                    series={[{ key: 'count', label: 'Count' }]}
                    height={chartHeights.sm}
                    getCellColor={(row) => row.color as string}
                  />
                </div>
              </Box>
            )}
          </Block>
        ))
      )}
    </Card>
  )
}
