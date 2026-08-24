import { chartHeights } from '@ingradient/ui'
import { chartColors } from '@ingradient/ui'
import styled from 'styled-components'
import { Inline, Text } from '@ingradient/ui/primitives'
import { BarChartCard } from '@ingradient/ui/patterns'
import { SectionPanel, Table, type TableColumn } from '@ingradient/ui/components'

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

const SECTION_TITLE_STYLE = { marginBottom: 'var(--ig-space-3)' }
const HEAD_STYLE = { marginBottom: 'var(--ig-space-4)' }
const CHART_STYLE = { marginTop: 'var(--ig-space-5)' }
const EMPTY_STYLE = { margin: 0 }

const CLASS_COLORS = ['var(--ig-color-accent)', chartColors.violet, chartColors.teal, chartColors.amber, chartColors.coral, chartColors.lightBlue, chartColors.lightViolet, chartColors.mint]

export interface ClassCount {
  class_id: string
  name: string
  count: number
}

const CLASS_COLUMNS: TableColumn<ClassCount>[] = [
  { key: 'name', header: 'Class', render: (item) => item.name },
  { key: 'count', header: 'Image count', numeric: true, render: (item) => item.count.toLocaleString() },
]

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
      <Inline justify="space-between" gap="var(--ig-space-5)" style={HEAD_STYLE}>
        <Text size="var(--ig-font-size-sm)" weight="semibold" tone="secondary">{title}</Text>
      </Inline>
      {datasetDistribution.length === 0 ? (
        <Text as="p" tone="soft" size="var(--ig-font-size-md)" style={EMPTY_STYLE}>{emptyText}</Text>
      ) : (
        datasetDistribution.map((dataset) => (
          <Block key={dataset.dataset_id}>
            <Text as="h3" tone="secondary" size="var(--ig-font-size-md)" weight="semibold" style={SECTION_TITLE_STYLE}>{dataset.name}</Text>
            {dataset.class_counts.length === 0 ? (
              <Text as="p" tone="soft" size="var(--ig-font-size-md)" style={EMPTY_STYLE}>{noLabelsText}</Text>
            ) : (
              <>
                <Table columns={CLASS_COLUMNS} rows={dataset.class_counts} ariaLabel={`${dataset.name} class counts`} />
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
