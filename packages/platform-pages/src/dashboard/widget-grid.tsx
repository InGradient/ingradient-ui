import { media } from '@ingradient/ui/tokens'
import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Stack } from '@ingradient/ui/primitives'

const Row = styled.div<{ $count: number }>`
  position: relative;
  display: grid;
  grid-template-columns: repeat(${(p) => Math.max(1, Math.min(3, p.$count))}, minmax(0, 1fr));
  gap: var(--ig-space-9);
  align-items: start;
  ${media.lg} {
    grid-template-columns: 1fr;
  }
`

export type WidgetGridLayout<K extends string = string> = Array<Array<K>>

export interface WidgetGridProps<K extends string = string> {
  /** Row 2D 배열의 widget key. 빈 row 는 자동 제거됨 */
  layout: WidgetGridLayout<K>
  /** 각 widget 의 시각화 element. visible 일 때만 렌더 */
  widgets: Partial<Record<K, ReactNode>>
  /** widget 별 visibility. 없으면 true 로 간주 */
  visibility?: Partial<Record<K, boolean>>
  /** 빈 grid 일 때 표시할 노드 */
  emptyState?: ReactNode
  className?: string
}

export function WidgetGrid<K extends string = string>({
  layout, widgets, visibility, emptyState, className,
}: WidgetGridProps<K>) {
  const isVisible = (key: K) => visibility?.[key] !== false && !!widgets[key]

  const visibleRows = layout
    .map((row) => row.filter(isVisible))
    .filter((row) => row.length > 0)

  if (visibleRows.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  return (
    <Stack gap={9} className={className}>
      {visibleRows.map((row, rowIndex) => (
        <Row key={`row-${rowIndex}-${row.join('-')}`} $count={row.length}>
          {row.map((key) => (
            <div key={key} data-widget-key={key}>
              {widgets[key]}
            </div>
          ))}
        </Row>
      ))}
    </Stack>
  )
}
