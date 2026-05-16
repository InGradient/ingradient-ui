import styled from 'styled-components'
import { BarChartCard } from '../../components/charts/bar-chart-card'

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const TableCard = styled.div`
  padding: 12px 16px;
  background: var(--ig-color-surface-panel);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-lg);
`

const PersonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  th, td {
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid var(--ig-color-border-subtle);
  }
  th {
    font-weight: 600;
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
    <Stack>
      <BarChartCard
        title="Uploader activity"
        data={byPerson.length === 0 ? [] : chartData}
        xKey="name"
        series={[
          { key: 'images', label: 'Images', color: '#6c5ce7' },
          { key: 'labeled', label: 'Labeled', color: 'var(--ig-color-accent)' },
        ]}
        height={260}
        emptyMessage="No uploader activity yet."
      />
      {byPerson.length > 0 ? (
        <TableCard>
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
        </TableCard>
      ) : null}
    </Stack>
  )
}
