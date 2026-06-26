import { chartHeights } from '@ingradient/ui'
import { Stack } from '@ingradient/ui/primitives'
import { BarChartCard } from '@ingradient/ui/patterns'
import { Card, Table, type TableColumn } from '@ingradient/ui/components'
import { chartColors } from '@ingradient/ui'

type PersonRow = { uploader: string; image_count: number; labeled_count: number }

const PERSON_COLUMNS: TableColumn<PersonRow>[] = [
  { key: 'uploader', header: 'Uploader', render: (person) => person.uploader },
  { key: 'images', header: 'Images', numeric: true, render: (person) => person.image_count.toLocaleString() },
  { key: 'labeled', header: 'Labeled', numeric: true, render: (person) => person.labeled_count.toLocaleString() },
]

export interface AnalysisLabelingByPersonWidgetProps {
  byPerson: PersonRow[]
  chartData: Array<{ name: string; fullName: string; images: number; labeled: number }>
}

/**
 * Uploader 별 Images / Labeled count BarChart + table.
 * Platform 의 `LabelingByPersonWidget` 와 시각·구조 동일.
 */
export function AnalysisLabelingByPersonWidget({
  byPerson,
  chartData,
}: AnalysisLabelingByPersonWidgetProps) {
  return (
    <Stack gap="var(--ig-space-7)">
      <BarChartCard
        title="Uploader activity"
        data={byPerson.length === 0 ? [] : chartData}
        xKey="name"
        series={[
          { key: 'images', label: 'Images', color: chartColors.violet },
          { key: 'labeled', label: 'Labeled', color: 'var(--ig-color-accent)' },
        ]}
        height={chartHeights.lg}
        emptyMessage="No uploader activity yet."
      />
      {byPerson.length > 0 ? (
        <Card elevation="panel" flat radius="var(--ig-radius-lg)" padding="var(--ig-space-5) var(--ig-space-7)">
          <Table columns={PERSON_COLUMNS} rows={byPerson} ariaLabel="Uploader activity" />
        </Card>
      ) : null}
    </Stack>
  )
}
