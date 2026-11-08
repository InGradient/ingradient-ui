import styled from 'styled-components'
import type { LogDetailTableViewProps } from './types'

const Table = styled.table`
  width: 100%;
  font-family: var(--ig-font-mono);
  font-size: var(--ig-text-caption);
  line-height: var(--ig-text-caption-leading);
  border-collapse: collapse;
`

const Th = styled.th`
  text-align: left;
  padding: var(--ig-spacing-8) var(--ig-spacing-8);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-muted);
  box-shadow: inset 0 var(--ig-space-neg-1px) 0 var(--ig-color-border-subtle);
  vertical-align: top;
  white-space: nowrap;
`

const Td = styled.td`
  padding: var(--ig-spacing-8) var(--ig-spacing-8);
  color: var(--ig-color-text-secondary);
  box-shadow: inset 0 var(--ig-space-neg-1px) 0 var(--ig-color-border-subtle);
  vertical-align: top;
  word-break: break-word;
`

function renderValue(v: unknown): string {
  if (v == null) return '—'
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v)
  try { return JSON.stringify(v) } catch { return String(v) }
}

/** Raw text 를 line 단위 parse — "key: value" 또는 그대로 표시. */
function parseTextToRows(text: string): { key: string; value: string }[] {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  return lines.map((line) => {
    const idx = line.indexOf(':')
    if (idx > 0 && idx < 40) {
      return { key: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() }
    }
    return { key: '', value: line }
  })
}

export function LogDetailTableView(props: LogDetailTableViewProps): JSX.Element | null {
  const { text, details } = props
  if (text != null) {
    const rows = parseTextToRows(text)
    if (rows.length === 0) return null
    return (
      <Table>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.key ? <Th>{row.key}</Th> : <Td colSpan={2}>{row.value}</Td>}
              {row.key && <Td>{row.value}</Td>}
            </tr>
          ))}
        </tbody>
      </Table>
    )
  }
  if (!details) return null
  const entries = Object.entries(details)
  return (
    <Table>
      <tbody>
        {entries.map(([k, v]) => (
          <tr key={k}>
            <Th>{k}</Th>
            <Td>{renderValue(v)}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
