import React from 'react'
import styled from 'styled-components'

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
`

const ToolBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  background: var(--ig-color-surface-muted);
  color: var(--ig-color-text-primary);
  cursor: pointer;
  transition: background var(--ig-motion-fast);
  &:hover:not(:disabled) { background: var(--ig-color-surface-interactive); }
  &:disabled { opacity: 0.4; cursor: default; }
`

const ZoomLabel = styled.span`
  min-width: 48px;
  text-align: center;
  font-size: var(--ig-font-size-xs);
  font-weight: 600;
  color: var(--ig-color-text-muted);
`

export interface ImageViewerToolbarProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  /** Extra tool buttons slot */
  children?: React.ReactNode
  className?: string
}

export function ImageViewerToolbar({
  zoom, onZoomIn, onZoomOut, onReset, children, className,
}: ImageViewerToolbarProps) {
  return (
    <Bar className={className} role="toolbar" aria-label="Image viewer controls">
      <ToolBtn type="button" onClick={onZoomOut} disabled={zoom <= 1} aria-label="Zoom out">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M8 11h6" />
        </svg>
      </ToolBtn>
      <ZoomLabel>{Math.round(zoom * 100)}%</ZoomLabel>
      <ToolBtn type="button" onClick={onZoomIn} aria-label="Zoom in">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M8 11h6" /><path d="M11 8v6" />
        </svg>
      </ToolBtn>
      <ToolBtn type="button" onClick={onReset} disabled={zoom <= 1} aria-label="Reset zoom">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
        </svg>
      </ToolBtn>
      {children}
    </Bar>
  )
}
