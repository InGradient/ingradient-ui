import { chartHeights } from '@ingradient/ui'
import { chartColors } from '@ingradient/ui'
import styled from 'styled-components'
import { DashboardCard as Card } from '../dashboard-card'
import { Inline, Text } from '@ingradient/ui/primitives'
import { BarChartCard } from '@ingradient/ui/patterns'
import { Table, type TableColumn } from '@ingradient/ui/components'

const Block = styled.div`
  margin-bottom: var(--ig-spacing-20);
  &:last-child { margin-bottom: 0; }
`

const SectionTitleBox = styled(Text)`
  margin-bottom: var(--ig-spacing-8);
`
const HeadBox = styled(Inline)`
  margin-bottom: var(--ig-spacing-8);
`
const ChartBox = styled.div`
  margin-top: var(--ig-spacing-12);
`
const EmptyBox = styled(Text)`
  margin: 0;
`

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
      <HeadBox justify="space-between" gap="var(--ig-spacing-12)">
        <Text size="var(--ig-text-body-sm)" weight="semibold" tone="secondary">{title}</Text>
      </HeadBox>
      {datasetDistribution.length === 0 ? (
        <EmptyBox forwardedAs="p" tone="soft" size="var(--ig-text-body)">{emptyText}</EmptyBox>
      ) : (
        datasetDistribution.map((dataset) => (
          <Block key={dataset.dataset_id}>
            <SectionTitleBox forwardedAs="h3" tone="secondary" size="var(--ig-text-body)" weight="semibold">{dataset.name}</SectionTitleBox>
            {dataset.class_counts.length === 0 ? (
              <EmptyBox forwardedAs="p" tone="soft" size="var(--ig-text-body)">{noLabelsText}</EmptyBox>
            ) : (
              <>
                <Table columns={CLASS_COLUMNS} rows={dataset.class_counts} ariaLabel={`${dataset.name} class counts`} />
                <ChartBox>
                  <BarChartCard
                    data={dataset.class_counts.map((d, i) => ({ name: d.name, count: d.count, color: CLASS_COLORS[i % CLASS_COLORS.length] }))}
                    xKey="name"
                    series={[{ key: 'count', label: 'Images' }]}
                    height={chartHeights.smPlus}
                    getCellColor={(row) => row.color as string}
                  />
                </ChartBox>
              </>
            )}
          </Block>
        ))
      )}
    </Card>
  )
}
