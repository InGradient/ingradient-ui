import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Download } from 'lucide-react'
import { Box, Inline } from '@ingradient/ui/primitives'
import { IconButton } from '@ingradient/ui/components'

const SHELL_STYLE = { position: 'relative' as const, minWidth: 0 }
const ACTIONS_STYLE = { position: 'absolute' as const, top: 'var(--ig-space-6)', right: 'var(--ig-space-6)', zIndex: 8 }

const ActionButton = styled(IconButton).attrs({ variant: 'secondary' as const, size: 'sm' as const })`
  color: var(--ig-color-text-secondary);
  transition: box-shadow var(--ig-motion-fast-ease), color var(--ig-motion-fast-ease);
  &:hover {
    color: var(--ig-color-text-primary);
    box-shadow: 0 0 0 1px var(--ig-color-blue-tint-28);
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
  return (
    <Box className={className} style={SHELL_STYLE}>
      {(onDownload || extraActions) ? (
        <Inline gap={3} data-report-hide style={ACTIONS_STYLE}>
          {onDownload ? (
            <ActionButton type="button" onClick={onDownload} title={downloadLabel} aria-label={downloadLabel}>
              <Download />
            </ActionButton>
          ) : null}
          {extraActions}
        </Inline>
      ) : null}
      {children}
    </Box>
  )
}
