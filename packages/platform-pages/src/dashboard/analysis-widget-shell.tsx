import type { ReactNode } from 'react'
import styled from 'styled-components'
import { IconButton, DownloadIcon } from '@ingradient/ui/components'

const Shell = styled.div<{ $hasActions: boolean }>`
  position: relative;
  min-width: 0;

  ${(p) =>
    p.$hasActions
      ? `
        --ig-analysis-widget-action-space: calc(
          var(--ig-control-height-sm) +
          var(--ig-control-height-sm) +
          var(--ig-spacing-8) +
          var(--ig-spacing-16)
        );

        [data-ig-chart-head] {
          padding-right: var(--ig-analysis-widget-action-space);
        }
      `
      : ''}
`

const Actions = styled.div`
  position: absolute;
  top: var(--ig-spacing-8);
  right: var(--ig-spacing-8);
  z-index: var(--ig-z-capture-top);
  display: flex;
  align-items: center;
  gap: var(--ig-spacing-8);
`

const ActionButton = styled(IconButton).attrs({ variant: 'secondary' as const, size: 'sm' as const })`
  color: var(--ig-color-text-secondary);
  transition: box-shadow var(--ig-motion-fast-ease), color var(--ig-motion-fast-ease);
  &:hover {
    color: var(--ig-color-text-primary);
    box-shadow: 0 0 0 var(--ig-border-1px) var(--ig-color-active-bg);
  }
  svg { width: var(--ig-icon-md); height: var(--ig-icon-md); }
`

export interface AnalysisWidgetShellProps {
  children: ReactNode
  /** download (PNG capture) callback */
  onDownload?: () => void
  /** 추가 액션 슬롯 — drag handle 등 */
  extraActions?: ReactNode
  downloadLabel?: string
  className?: string
}

export function AnalysisWidgetShell({
  children, onDownload, extraActions,
  downloadLabel = 'Download widget image',
  className,
}: AnalysisWidgetShellProps) {
  const hasActions = !!(onDownload || extraActions)
  return (
    <Shell className={className} $hasActions={hasActions}>
      {hasActions ? (
        <Actions data-report-hide>
          {onDownload ? (
            <ActionButton type="button" onClick={onDownload} title={downloadLabel} aria-label={downloadLabel}>
              <DownloadIcon />
            </ActionButton>
          ) : null}
          {extraActions}
        </Actions>
      ) : null}
      {children}
    </Shell>
  )
}
