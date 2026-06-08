import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Inline } from '../../primitives'
import { ResizeHandle } from '../inputs/resize-handle'

export interface ResizableColumn {
  /** px 너비 (number) 또는 'auto' (flex:1 — 한 컬럼만 가능). */
  width: number | 'auto'
  /** drag-to-resize 핸들 표시. auto 컬럼은 무시됨. */
  resizable?: boolean
  /** min/max 제한 (resize 시). */
  minWidth?: number
  maxWidth?: number
  /** collapse 시 width 0 + transition. 외부 제어 (controlled). */
  collapsed?: boolean
  /** 아예 안 보이게. 컬럼/핸들 모두 미렌더. (예: 옵셔널 inspector). */
  hidden?: boolean
  /** Column 표면 배경색 (optional). */
  background?: string
}

export interface ResizableColumnsLayoutProps {
  /** N 컬럼 정의. 정확히 한 컬럼만 `width: 'auto'` 가능. */
  columns: ResizableColumn[]
  /** children.length === columns.length. 각 child 가 한 컬럼에 매핑. */
  children: React.ReactNode
  /** localStorage 에 각 컬럼 width 를 `${storageKey}-${i}` 형식으로 저장. */
  storageKey?: string
  className?: string
  style?: React.CSSProperties
}

const ROOT_STYLE = { width: '100%', height: '100%', minHeight: 0 }

const Column = styled.aside<{ $width: number | 'auto'; $collapsed: boolean; $bg?: string }>`
  flex: ${(p) => {
    if (p.$width === 'auto') return '1'
    if (p.$collapsed) return '0 0 0'
    return `0 0 ${p.$width}px`
  }};
  width: ${(p) => {
    if (p.$width === 'auto') return 'auto'
    return p.$collapsed ? '0' : `${p.$width}px`
  }};
  min-width: 0;
  overflow: hidden;
  ${(p) => p.$bg && `background: ${p.$bg};`}
  ${(p) => p.$collapsed && 'transition: flex-basis var(--ig-motion-fast), width var(--ig-motion-fast);'}
`

/**
 * N-column 유연 layout. 각 컬럼은 고정 px 또는 'auto' (flex:1). resizable 컬럼은
 * 옆에 ResizeHandle 표시 + drag 로 width 조정. localStorage 로 width 영속화 지원.
 *
 * Drag 방향은 auto 컬럼 기준 자동 결정: auto 왼쪽 컬럼은 +delta, 오른쪽은 -delta.
 *
 * 정적 grid layout 은 SplitLayout / DashboardGrid / ListDetailLayout (patterns/layouts) 사용.
 */
export function ResizableColumnsLayout({
  columns, children, storageKey, className, style,
}: ResizableColumnsLayoutProps) {
  const kids = React.Children.toArray(children)
  const autoIdx = columns.findIndex((c) => c.width === 'auto')

  const [widths, setWidths] = useState<number[]>(() =>
    columns.map((c, i) => {
      const fallback = typeof c.width === 'number' ? c.width : 0
      return readStored(storageKey, i, fallback)
    })
  )

  useEffect(() => {
    if (storageKey) return
    setWidths(columns.map((c) => (typeof c.width === 'number' ? c.width : 0)))
  }, [columns, storageKey])

  useEffect(() => {
    if (!storageKey) return
    widths.forEach((w, i) => writeStored(storageKey, i, w))
  }, [widths, storageKey])

  const startResize = useCallback((i: number, e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startW = widths[i] ?? 0
    const sign = i < autoIdx ? 1 : -1
    const col = columns[i]
    const minW = col?.minWidth ?? 0
    const maxW = col?.maxWidth ?? 9999
    const move = (ev: MouseEvent) => {
      const delta = (ev.clientX - startX) * sign
      const next = Math.min(maxW, Math.max(minW, startW + delta))
      setWidths((w) => {
        const a = [...w]
        a[i] = next
        return a
      })
    }
    const stop = () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', stop)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', stop)
  }, [widths, autoIdx, columns])

  return (
    <Inline gap={0} wrap="nowrap" className={className} style={{ ...ROOT_STYLE, ...style }}>
      {columns.map((c, i) => {
        if (c.hidden) return null
        const collapsed = !!c.collapsed
        const width = c.width === 'auto' ? 'auto' : widths[i]
        const showHandle = c.resizable && !collapsed && i !== autoIdx
        const handle = showHandle ? <ResizeHandle onMouseDown={(e) => startResize(i, e)} /> : null
        return (
          <React.Fragment key={i}>
            {i > autoIdx ? handle : null}
            <Column $width={width} $collapsed={collapsed} $bg={c.background}>
              {kids[i]}
            </Column>
            {i < autoIdx ? handle : null}
          </React.Fragment>
        )
      })}
    </Inline>
  )
}

function readStored(key: string | undefined, idx: number, fallback: number): number {
  if (!key || typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(`${key}-${idx}`)
    const n = raw ? Number(raw) : NaN
    return Number.isFinite(n) && n > 0 ? n : fallback
  } catch {
    return fallback
  }
}

function writeStored(key: string, idx: number, value: number): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(`${key}-${idx}`, String(value))
  } catch {
    /* noop */
  }
}
