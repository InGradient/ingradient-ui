import React from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
  overflow-x: auto;
`

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
  border-radius: var(--ig-radius-xs);
  font-size: var(--ig-font-size-xs);
  color: ${(p) => (p.$intensity > 0.5 ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-secondary)')};
  text-align: center;
  padding: var(--ig-space-2) var(--ig-space-3);
  font-variant-numeric: tabular-nums;
  min-width: 56px;
`

export interface HeatmapCell {
  value: number
}

export interface DatasetDistributionHeatmapProps {
  rowLabels: string[]
  columnLabels: string[]
  matrix: number[][]
  className?: string
}

export function DatasetDistributionHeatmap({
  rowLabels, columnLabels, matrix, className,
}: DatasetDistributionHeatmapProps) {
  const max = matrix.reduce((acc, row) => Math.max(acc, ...row), 0) || 1
  return (
    <Wrap className={className}>
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
                <Cell key={j} $intensity={value / max}>{value}</Cell>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Wrap>
  )
}
