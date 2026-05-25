import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Box, Inline, Stack } from '../../primitives'
import { ResizeHandle } from '../../components/inputs/resize-handle'

const ROOT_STYLE = {
  width: '100%',
  height: '100%',
  minHeight: 0,
  background: 'var(--ig-color-bg-canvas)',
}

const Left = styled.aside<{ $width: number; $collapsed: boolean }>`
  flex: 0 0 ${(p) => (p.$collapsed ? '0px' : `${p.$width}px`)};
  width: ${(p) => (p.$collapsed ? 0 : p.$width)}px;
  min-width: 0;
  overflow: hidden;
  transition: ${(p) => (p.$collapsed ? 'flex-basis var(--ig-motion-fast), width var(--ig-motion-fast)' : 'none')};
`

const CENTER_STYLE = { flex: 1, minWidth: 0, minHeight: 0 }
const SLOT_STYLE = { flex: '0 0 auto' }
const BODY_STYLE = { flex: 1, minHeight: 0, overflow: 'auto' as const, position: 'relative' as const }

const Right = styled.aside<{ $width: number }>`
  flex: 0 0 ${(p) => p.$width}px;
  width: ${(p) => p.$width}px;
  min-width: 0;
  overflow: hidden;
  background: var(--ig-color-surface-panel);
`

export interface CatalogShellProps {
  leftSidebar?: React.ReactNode
  toolbar?: React.ReactNode
  body: React.ReactNode
  selectionBar?: React.ReactNode
  rightSidebar?: React.ReactNode
  leftWidth?: number
  rightWidth?: number
  sidebarCollapsed?: boolean
  resizable?: boolean
  minLeftWidth?: number
  maxLeftWidth?: number
  minRightWidth?: number
  maxRightWidth?: number
  /** localStorage 에 좌·우 사이드바 width 를 저장. key prefix 로 사용 (e.g. 'ig-catalog-shell') */
  storageKey?: string
  className?: string
}

export function CatalogShell({
  leftSidebar, toolbar, body, selectionBar, rightSidebar,
  leftWidth = 320, rightWidth = 320, sidebarCollapsed = false, resizable = true,
  minLeftWidth = 220, maxLeftWidth = 480, minRightWidth = 220, maxRightWidth = 480,
  storageKey,
  className,
}: CatalogShellProps) {
  const [leftW, setLeftW] = useState(() => readStored(storageKey, 'left', leftWidth))
  const [rightW, setRightW] = useState(() => readStored(storageKey, 'right', rightWidth))
  useEffect(() => { if (!storageKey) setLeftW(leftWidth) }, [leftWidth, storageKey])
  useEffect(() => { if (!storageKey) setRightW(rightWidth) }, [rightWidth, storageKey])

  const startResize = useCallback((side: 'left' | 'right', e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startW = side === 'left' ? leftW : rightW
    const move = (ev: MouseEvent) => {
      const delta = ev.clientX - startX
      if (side === 'left') {
        const next = Math.min(maxLeftWidth, Math.max(minLeftWidth, startW + delta))
        setLeftW(next)
      } else {
        const next = Math.min(maxRightWidth, Math.max(minRightWidth, startW - delta))
        setRightW(next)
      }
    }
    const stop = () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', stop)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', stop)
  }, [leftW, rightW, minLeftWidth, maxLeftWidth, minRightWidth, maxRightWidth])

  // width 변경 시 storage 저장 (resize 중에도 호출되지만, set 빈도가 낮아 충분히 저렴)
  useEffect(() => { if (storageKey) writeStored(storageKey, 'left', leftW) }, [leftW, storageKey])
  useEffect(() => { if (storageKey) writeStored(storageKey, 'right', rightW) }, [rightW, storageKey])

  return (
    <Inline gap={0} wrap="nowrap" className={className} data-ig-component="CatalogShell" data-ig-layer="patterns" style={ROOT_STYLE}>
      {leftSidebar ? <Left $width={leftW} $collapsed={sidebarCollapsed}>{leftSidebar}</Left> : null}
      {resizable && leftSidebar && !sidebarCollapsed ? <ResizeHandle onMouseDown={(e) => startResize('left', e)} /> : null}
      <Stack gap={0} style={CENTER_STYLE}>
        {toolbar ? <Box style={SLOT_STYLE}>{toolbar}</Box> : null}
        <Box style={BODY_STYLE}>{body}</Box>
        {selectionBar ? <Box style={SLOT_STYLE}>{selectionBar}</Box> : null}
      </Stack>
      {resizable && rightSidebar ? <ResizeHandle onMouseDown={(e) => startResize('right', e)} /> : null}
      {rightSidebar ? <Right $width={rightW}>{rightSidebar}</Right> : null}
    </Inline>
  )
}

function readStored(key: string | undefined, side: 'left' | 'right', fallback: number): number {
  if (!key || typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(`${key}-${side}`)
    const n = raw ? Number(raw) : NaN
    return Number.isFinite(n) && n > 0 ? n : fallback
  } catch { return fallback }
}

function writeStored(key: string, side: 'left' | 'right', value: number): void {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(`${key}-${side}`, String(value)) } catch { /* noop */ }
}
