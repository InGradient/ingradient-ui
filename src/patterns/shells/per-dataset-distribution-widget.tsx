import styled from 'styled-components'
import { Text } from '../../primitives'
import { BarChartCard } from '../charts/bar-chart-card'
import { SectionPanel } from '../../components/data-display/layout'

const Card = styled(SectionPanel)`
  background: var(--ig-color-surface-raised);
  border-color: var(--ig-color-border-strong);
  border-radius: var(--ig-radius-xxs);
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
  margin-bottom: var(--ig-space-9);
  &:last-child { margin-bottom: 0; }
`

const SECTION_TITLE_STYLE = { marginBottom: 'var(--ig-space-3)' }

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

const CLASS_COLORS = ['var(--ig-color-accent)', '#6c5ce7', '#00b894', '#fdcb6e', '#e17055', '#74b9ff', '#a29bfe', '#55efc4']

export interface ClassCount {
  class_id: string
  name: string
  count: number
}

export interface PerDatasetDistributionDataset {
  dataset_id: string
  name: string
  class_counts: ClassCount[]
}

export interface PerDatasetDistributionWidgetProps {
  datasetDistribution: PerDatasetDistributionDataset[]
  title?: string
  emptyText?: string
  noLabelsText?: string
  className?: string
}

export function PerDatasetDistributionWidget({
  datasetDistribution,
  title = 'Per-dataset class counts',
  emptyText = 'No datasets.',
  noLabelsText = 'No class labels in this dataset.',
  className,
}: PerDatasetDistributionWidgetProps) {
  return (
    <Card className={className}>
      <Head><Title>{title}</Title></Head>
      {datasetDistribution.length === 0 ? (
        <Empty>{emptyText}</Empty>
      ) : (
        datasetDistribution.map((dataset) => (
          <Block key={dataset.dataset_id}>
            <Text as="h3" tone="secondary" size="14px" weight={600} style={SECTION_TITLE_STYLE}>{dataset.name}</Text>
            {dataset.class_counts.length === 0 ? (
              <Empty>{noLabelsText}</Empty>
            ) : (
              <>
                <Table>
                  <thead><tr><th>Class</th><th>Image count</th></tr></thead>
                  <tbody>
                    {dataset.class_counts.map((item) => (
                      <tr key={item.class_id}>
                        <td>{item.name}</td>
                        <td>{item.count.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div style={{ marginTop: 12 }}>
                  <BarChartCard
                    data={dataset.class_counts.map((d, i) => ({ name: d.name, count: d.count, color: CLASS_COLORS[i % CLASS_COLORS.length] }))}
                    xKey="name"
                    series={[{ key: 'count', label: 'Images' }]}
                    height={220}
                    getCellColor={(row) => row.color as string}
                  />
                </div>
              </>
            )}
          </Block>
        ))
      )}
    </Card>
  )
}
