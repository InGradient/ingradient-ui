import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Box, Inline, Stack, Text } from '../../primitives'
import { Button } from '../../components/inputs/button'
import { Panel, PanelHeader, PanelHint, PanelTitle } from '../page/page-shell'

const HEADER_MAIN_STYLE = { minWidth: 0, gap: 'var(--ig-space-1)' }
const HEADER_ACTIONS_STYLE = { position: 'relative' as const }
const BODY_STYLE = { padding: 'var(--ig-space-7)', overflow: 'visible' as const }
const PLACEHOLDER_STYLE = { margin: 0 }

const DateButton = styled(Button).attrs({ variant: 'secondary' as const })`
  padding: var(--ig-space-3) var(--ig-space-5);
  min-height: 36px;
  font-size: 12px;
  font-weight: 600;
`

const ResetButton = styled(DateButton)`
  min-width: 0;
`

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
          {onResetLayout ? <ResetButton type="button" onClick={onResetLayout}>Reset</ResetButton> : null}
          <DateButton type="button" onClick={onToggleDate}>{dateLabel}</DateButton>
          {datePopover}
        </Inline>
      </PanelHeader>
      <Box style={BODY_STYLE}>
        {state === 'no-project' ? <Text as="p" tone="soft" size="14px" align="center" style={PLACEHOLDER_STYLE}>{emptyText}</Text>
          : state === 'loading' ? <Text as="p" tone="soft" size="14px" align="center" style={PLACEHOLDER_STYLE}>{loadingText}</Text>
          : state === 'error' ? <Text as="p" tone="soft" size="14px" align="center" style={PLACEHOLDER_STYLE}>{errorMessage ?? 'Error'}</Text>
          : children ? children
          : <Text as="p" tone="soft" size="14px" align="center" style={PLACEHOLDER_STYLE}>{noDataText}</Text>}
      </Box>
    </Panel>
  )
}
