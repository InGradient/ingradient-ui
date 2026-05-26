import React from 'react'
import styled from 'styled-components'
import { Box } from '../primitives'

const WRAP_STYLE = { overflowX: 'auto' as const }

const Table = styled.table`
  border-collapse: separate;
  border-spacing: 2px;
  width: 100%;
`

const HeadCell = styled.th`
  font-size: var(--ig-font-size-xs);
  font-weight: 600;
  color: var(--ig-color-text-muted);
  text-align: center;
  padding: var(--ig-space-2);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
`

const RowLabel = styled.th`
  font-size: var(--ig-font-size-xs);
  font-weight: 500;
  color: var(--ig-color-text-secondary);
  text-align: left;
  padding: var(--ig-space-2) var(--ig-space-3);
  white-space: nowrap;
`

const Cell = styled.td<{ $intensity: number }>`
  background: rgba(77, 136, 255, ${(p) => 0.08 + p.$intensity * 0.55});
  border-radius: var(--ig-radius-2xs);
  font-size: var(--ig-font-size-xs);
  color: ${(p) => (p.$intensity > 0.5 ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-secondary)')};
  text-align: center;
  padding: var(--ig-space-2) var(--ig-space-3);
  font-variant-numeric: tabular-nums;
  min-width: 56px;
`

export interface DistributionHeatmapProps {
  /** 좌측 row 라벨 (행 머리글). */
  rowLabels: string[]
  /** 상단 column 라벨 (열 머리글). */
  columnLabels: string[]
  /** matrix[row][col] = number. 모든 행은 columnLabels.length 길이여야 함. */
  matrix: number[][]
  /** Cell 값 표시 포맷팅 — 기본 toString(). */
  formatValue?: (value: number) => React.ReactNode
  className?: string
}

/**
 * row × column 교차 distribution 을 색 강도 (intensity) 로 표시하는 generic heatmap.
 * 셀의 색 강도는 matrix 전체의 max 값 대비 비율로 결정 — 가장 큰 값이 가장 진한 색.
 *
 * 도메인 무관: dataset distribution / class confusion matrix / time-of-day activity 등 활용 가능.
 */
export function DistributionHeatmap({
  rowLabels, columnLabels, matrix, formatValue, className,
}: DistributionHeatmapProps) {
  const max = matrix.reduce((acc, row) => Math.max(acc, ...row), 0) || 1
  const format = formatValue ?? ((v: number) => v)
  return (
    <Box className={className} style={WRAP_STYLE}>
      <Table>
        <thead>
          <tr>
            <HeadCell />
            {columnLabels.map((c) => (<HeadCell key={c}>{c}</HeadCell>))}
          </tr>
        </thead>
        <tbody>
          {rowLabels.map((rowLabel, i) => (
            <tr key={rowLabel}>
              <RowLabel scope="row">{rowLabel}</RowLabel>
              {(matrix[i] ?? []).map((value, j) => (
                <Cell key={j} $intensity={value / max}>{format(value)}</Cell>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  )
}
