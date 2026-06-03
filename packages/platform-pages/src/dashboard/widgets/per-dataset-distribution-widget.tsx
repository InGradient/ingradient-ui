import { chartHeights } from '@ingradient/ui'
import styled from 'styled-components'
import { Inline, Text } from '@ingradient/ui/primitives'
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
  margin-bottom: var(--ig-space-9);
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

const SECTION_TITLE_STYLE = { marginBottom: 'var(--ig-space-3)' }
const HEAD_STYLE = { marginBottom: 'var(--ig-space-4)' }
const CHART_STYLE = { marginTop: 'var(--ig-space-5)' }
const EMPTY_STYLE = { margin: 0 }

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
      <Inline justify="space-between" gap={5} style={HEAD_STYLE}>
        <Text size="var(--ig-font-size-sm)" weight={600} tone="secondary">{title}</Text>
      </Inline>
      {datasetDistribution.length === 0 ? (
        <Text as="p" tone="soft" size="var(--ig-font-size-md)" style={EMPTY_STYLE}>{emptyText}</Text>
      ) : (
        datasetDistribution.map((dataset) => (
          <Block key={dataset.dataset_id}>
            <Text as="h3" tone="secondary" size="var(--ig-font-size-md)" weight={600} style={SECTION_TITLE_STYLE}>{dataset.name}</Text>
            {dataset.class_counts.length === 0 ? (
              <Text as="p" tone="soft" size="var(--ig-font-size-md)" style={EMPTY_STYLE}>{noLabelsText}</Text>
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
                <div style={CHART_STYLE}>
                  <BarChartCard
                    data={dataset.class_counts.map((d, i) => ({ name: d.name, count: d.count, color: CLASS_COLORS[i % CLASS_COLORS.length] }))}
                    xKey="name"
                    series={[{ key: 'count', label: 'Images' }]}
                    height={chartHeights.smPlus}
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
