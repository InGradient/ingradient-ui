import { useMemo, useState, type ReactNode } from 'react'
import styled from 'styled-components'
import { Box, Inline } from '@ingradient/ui/primitives'
import { TextField } from '@ingradient/ui/components'
import { HelpTooltip } from '@ingradient/ui/components'

const SEARCH_WRAP_STYLE = {
  marginBottom: 'var(--ig-space-5)',
  maxWidth: 'var(--ig-popup-xs-plus)',
}

const SCROLLER_STYLE = { overflow: 'auto' as const, maxWidth: '100%' }

const TABLE_WRAP_STYLE = {
  display: 'inline-block' as const,
  width: 'fit-content',
  border: 'var(--ig-border-1px) solid var(--ig-color-border-strong)',
  borderRadius: 'var(--ig-radius-xxs)',
  background: 'var(--ig-color-surface-panel)',
}

const HEADER_CONTENT_STYLE = {
  justifyContent: 'center' as const,
  flexWrap: 'wrap' as const,
}

const StyledTable = styled.table`
  width: max-content;
  border-collapse: collapse;
  & th {
    padding: var(--ig-space-4) var(--ig-space-3);
    border-bottom: var(--ig-border-1px) solid var(--ig-color-border-strong);
    border-right: var(--ig-border-1px) solid var(--ig-color-border-subtle);
    background: var(--ig-color-surface-raised);
    color: var(--ig-color-text-secondary);
    font-size: var(--ig-font-size-xs);
    text-align: center;
    vertical-align: bottom;
  }
  & th.sticky-row-header {
    position: sticky;
    left: 0;
    z-index: var(--ig-z-raised);
  }
  & td {
    padding: var(--ig-space-3);
    border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
    border-right: var(--ig-border-1px) solid var(--ig-color-border-subtle);
    text-align: center;
  }
  & td.row-label {
    padding: var(--ig-space-4) var(--ig-space-5);
    color: var(--ig-color-text-primary);
    font-size: var(--ig-font-size-sm);
    font-weight: var(--ig-font-weight-semibold);
    white-space: nowrap;
    position: sticky;
    left: 0;
    z-index: var(--ig-z-base);
    background: var(--ig-color-surface-panel);
    text-align: left;
  }
`

export interface PermissionMatrixColumn {
  key: string
  label: ReactNode
  /** Optional help text shown via `?` HelpTooltip beside the column label. */
  description?: string
}

export interface PermissionMatrixColumnGroup {
  key: string
  label: string
  columns: PermissionMatrixColumn[]
}

export interface PermissionMatrixRow {
  key: string
  label: ReactNode
  /** Filter token — search 활성화 시 row 매칭에 사용. label 이 string 이 아닐 때 필요. */
  filterText?: string
}

export interface PermissionMatrixProps {
  rows: PermissionMatrixRow[]
  columnGroups: PermissionMatrixColumnGroup[]
  /** 각 (row, column) 교차점 셀 렌더 — caller 가 Checkbox / Radio / Indicator 결정. */
  renderCell: (row: PermissionMatrixRow, column: PermissionMatrixColumn) => ReactNode
  /** 좌상단 row-header 셀 라벨. 기본 "Row". */
  rowHeaderLabel?: ReactNode
  /** 좌상단 row-header 셀 최소 너비. 기본 120px. */
  rowHeaderMinWidth?: number
  /** Search field 표시 + row label 필터. 없으면 검색 X. */
  searchPlaceholder?: string
  /** Search 의 aria-label. 기본 "Search rows". */
  searchAriaLabel?: string
  className?: string
}

/**
 * 권한 / 옵션 / 기능 등을 row × column 교차 grid 로 표시하는 generic matrix.
 * Sticky row-label column + 2-level column header (group → column) + caller-defined cell renderer.
 * Caller 가 도메인 결합 (RoleMatrix 같은 state) 을 담당하고, 시각/스크롤/검색은 이 컴포넌트가 처리.
 */
export function PermissionMatrix({
  rows,
  columnGroups,
  renderCell,
  rowHeaderLabel = 'Row',
  rowHeaderMinWidth = 120,
  searchPlaceholder,
  searchAriaLabel = 'Search rows',
  className,
}: PermissionMatrixProps) {
  const [search, setSearch] = useState('')
  const visibleRows = useMemo(() => {
    if (!searchPlaceholder) return rows
    const query = search.trim().toLowerCase()
    if (!query) return rows
    return rows.filter((r) => {
      const text = r.filterText ?? (typeof r.label === 'string' ? r.label : '')
      return text.toLowerCase().includes(query)
    })
  }, [rows, search, searchPlaceholder])

  return (
    <div className={className}>
      {searchPlaceholder ? (
        <Box style={SEARCH_WRAP_STYLE}>
          <TextField
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={searchAriaLabel}
          />
        </Box>
      ) : null}
      <Box style={SCROLLER_STYLE}>
        <Box style={TABLE_WRAP_STYLE}>
          <StyledTable>
            <thead>
              <tr>
                <th className="sticky-row-header" rowSpan={2} style={{ minWidth: rowHeaderMinWidth }}>
                  {rowHeaderLabel}
                </th>
                {columnGroups.map((group) => (
                  <th key={group.key} colSpan={group.columns.length}>{group.label}</th>
                ))}
              </tr>
              <tr>
                {columnGroups.flatMap((group) =>
                  group.columns.map((column) => (
                    <th key={column.key}>
                      <Inline as="span" gap="var(--ig-space-2)" style={HEADER_CONTENT_STYLE}>
                        <span>{column.label}</span>
                        {column.description ? <HelpTooltip text={column.description} /> : null}
                      </Inline>
                    </th>
                  )),
                )}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.key}>
                  <td className="row-label">{row.label}</td>
                  {columnGroups.flatMap((group) =>
                    group.columns.map((column) => (
                      <td key={`${row.key}-${column.key}`}>
                        {renderCell(row, column)}
                      </td>
                    )),
                  )}
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </Box>
      </Box>
    </div>
  )
}
