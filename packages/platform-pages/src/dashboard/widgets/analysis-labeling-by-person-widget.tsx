import { chartHeights } from '@ingradient/ui'
import styled from 'styled-components'
import { Stack } from '@ingradient/ui/primitives'
import { BarChartCard } from '@ingradient/ui/patterns'
import { chartColors } from '@ingradient/ui'

const TABLE_CARD_STYLE = {
  padding: 'var(--ig-space-5) var(--ig-space-7)',
  background: 'var(--ig-color-surface-panel)',
  border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
  borderRadius: 'var(--ig-radius-lg)',
}

const PersonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--ig-font-size-sm);
  th, td {
    padding: var(--ig-space-3) var(--ig-space-5);
    text-align: left;
    border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  }
  th {
    font-weight: var(--ig-font-weight-semibold);
    color: var(--ig-color-text-soft);
  }
  td {
    color: var(--ig-color-text-primary);
  }
  tr:last-child td {
    border-bottom: none;
  }
`

export interface AnalysisLabelingByPersonWidgetProps {
  byPerson: Array<{ uploader: string; image_count: number; labeled_count: number }>
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
    <Stack gap={7}>
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
        <div style={TABLE_CARD_STYLE}>
          <PersonTable>
            <thead>
              <tr>
                <th>Uploader</th>
                <th>Images</th>
                <th>Labeled</th>
              </tr>
            </thead>
            <tbody>
              {byPerson.map((person) => (
                <tr key={person.uploader}>
                  <td>{person.uploader}</td>
                  <td>{person.image_count.toLocaleString()}</td>
                  <td>{person.labeled_count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </PersonTable>
        </div>
      ) : null}
    </Stack>
  )
}
