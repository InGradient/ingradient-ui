import type { ReactNode } from 'react'
import { Box, Inline, Stack, Text } from '@ingradient/ui/primitives'
import { Button } from '@ingradient/ui/components'
import { Panel, PanelHeader, PanelHint, PanelTitle } from '@ingradient/ui/patterns'

const HEADER_MAIN_STYLE = { minWidth: 0, gap: 'var(--ig-space-1)' }
const HEADER_ACTIONS_STYLE = { position: 'relative' as const }
const BODY_STYLE = { padding: 'var(--ig-space-7)', overflow: 'visible' as const }
const PLACEHOLDER_STYLE = { margin: 0 }

const DATE_BTN_STYLE = {
  padding: 'var(--ig-space-3) var(--ig-space-5)',
  minHeight: 36,
  fontSize: 12,
  fontWeight: 600,
}

const RESET_BTN_STYLE = { ...DATE_BTN_STYLE, minWidth: 0 }

export interface DashboardOverviewPanelProps {
  title?: string
  hint?: string
  dateLabel: string
  /** date range popover. open 시 popover 가 보이도록 caller 가 직접 렌더 */
  datePopover?: ReactNode
  onToggleDate?: () => void
  onResetLayout?: () => void
  /** body 슬롯. 4 state 중 하나로 caller 가 컨트롤 */
  state?: 'no-project' | 'loading' | 'error' | 'data'
  errorMessage?: string | null
  emptyText?: string
  loadingText?: string
  noDataText?: string
  children?: ReactNode
  className?: string
}

export function DashboardOverviewPanel({
  title = 'Project Overview',
  hint, dateLabel, datePopover,
  onToggleDate, onResetLayout,
  state = 'data',
  errorMessage,
  emptyText = 'Select a project to load dashboard stats.',
  loadingText = 'Loading dashboard…',
  noDataText = 'No dashboard data.',
  children, className,
}: DashboardOverviewPanelProps) {
  return (
    <Panel className={className}>
      <PanelHeader>
        <Stack gap={1} style={HEADER_MAIN_STYLE}>
          <PanelTitle>{title}</PanelTitle>
          {hint ? <PanelHint>{hint}</PanelHint> : null}
        </Stack>
        <Inline gap={4} wrap="wrap" data-report-hide style={HEADER_ACTIONS_STYLE}>
          {onResetLayout ? <Button type="button" variant="secondary" onClick={onResetLayout} style={RESET_BTN_STYLE}>Reset</Button> : null}
          <Button type="button" variant="secondary" onClick={onToggleDate} style={DATE_BTN_STYLE}>{dateLabel}</Button>
          {datePopover}
        </Inline>
      </PanelHeader>
      <Box style={BODY_STYLE}>
        {state === 'no-project' ? <Text as="p" tone="soft" size="var(--ig-font-size-md)" align="center" style={PLACEHOLDER_STYLE}>{emptyText}</Text>
          : state === 'loading' ? <Text as="p" tone="soft" size="var(--ig-font-size-md)" align="center" style={PLACEHOLDER_STYLE}>{loadingText}</Text>
          : state === 'error' ? <Text as="p" tone="soft" size="var(--ig-font-size-md)" align="center" style={PLACEHOLDER_STYLE}>{errorMessage ?? 'Error'}</Text>
          : children ? children
          : <Text as="p" tone="soft" size="var(--ig-font-size-md)" align="center" style={PLACEHOLDER_STYLE}>{noDataText}</Text>}
      </Box>
    </Panel>
  )
}
