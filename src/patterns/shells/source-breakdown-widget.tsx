import styled from 'styled-components'
import { BarChartCard } from '../charts/bar-chart-card'
import { SectionPanel } from '../../components/data-display/layout'

const Card = styled(SectionPanel)`
  background: var(--ig-color-surface-raised);
  border-color: var(--ig-color-border-strong);
  border-radius: var(--ig-radius-xs);
  padding: var(--ig-space-7) var(--ig-space-9);
  gap: var(--ig-space-5);
`

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-5);
  margin-bottom: var(--ig-space-4);
`

const Title = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--ig-color-text-secondary);
`

const Empty = styled.p`
  margin: 0;
  color: var(--ig-color-text-soft);
  font-size: 14px;
`

const Block = styled.div`
  margin-bottom: var(--ig-space-7);
  &:last-child { margin-bottom: 0; }
`

const Chip = styled.span`
  display: inline-block;
  padding: 2px var(--ig-space-3);
  background: var(--ig-color-surface-raised);
  border-radius: var(--ig-radius-xs);
  font-size: 12px;
  color: var(--ig-color-text-muted);
`

const TableWrap = styled.div`
  margin-top: var(--ig-space-3);
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  th, td {
    padding: var(--ig-space-3) var(--ig-space-5);
    text-align: left;
    border-bottom: 1px solid var(--ig-color-border-strong);
  }
  th { color: var(--ig-color-text-muted); font-weight: 500; }
  td { color: var(--ig-color-text-primary); }
`

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
      <Head><Title>{title}</Title></Head>
      {bySource.length === 0 ? (
        <Empty>{emptyText}</Empty>
      ) : (
        bySource.map((source) => (
          <Block key={`${source.source}-${source.camera_ip ?? ''}`}>
            <Chip>{source.source === 'camera' && source.camera_ip ? `Camera ${source.camera_ip}` : source.source}</Chip>
            {source.defect_counts.length === 0 ? (
              <Empty style={{ marginTop: 12 }}>{noDefectText}</Empty>
            ) : (
              <TableWrap>
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
                <div style={{ marginTop: 12 }}>
                  <BarChartCard
                    data={source.defect_counts.map((d, i) => ({ name: d.name, count: d.count, color: SOURCE_COLORS[i % SOURCE_COLORS.length] }))}
                    xKey="name"
                    series={[{ key: 'count', label: 'Count' }]}
                    height={200}
                    getCellColor={(row) => row.color as string}
                  />
                </div>
              </TableWrap>
            )}
          </Block>
        ))
      )}
    </Card>
  )
}
