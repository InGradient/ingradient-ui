import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Download } from 'lucide-react'
import { IconButton } from '../../components/inputs/icon-button'

const Shell = styled.div`
  position: relative;
  min-width: 0;
`

const Actions = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 8;
  display: flex;
  align-items: center;
  gap: 8px;
`

const ActionButton = styled(IconButton).attrs({ variant: 'secondary' as const, size: 'sm' as const })`
  color: var(--ig-color-text-secondary);
  transition: box-shadow 0.16s ease, color 0.16s ease;
  &:hover {
    color: var(--ig-color-text-primary);
    box-shadow: 0 0 0 1px var(--ig-color-blue-tint-28);
  }
  svg { width: 16px; height: 16px; }
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
  return (
    <Shell className={className}>
      {(onDownload || extraActions) ? (
        <Actions data-report-hide>
          {onDownload ? (
            <ActionButton type="button" onClick={onDownload} title={downloadLabel} aria-label={downloadLabel}>
              <Download />
            </ActionButton>
          ) : null}
          {extraActions}
        </Actions>
      ) : null}
      {children}
    </Shell>
  )
}
