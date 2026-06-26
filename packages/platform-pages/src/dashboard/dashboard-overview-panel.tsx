import { iconSizeNumbers } from '@ingradient/ui'
import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Inline, Stack, stateCenteredLayout, stateTitleText } from '@ingradient/ui/primitives'
import { Button, Spinner } from '@ingradient/ui/components'
import { Panel, PanelHeader, PanelHint, PanelTitle } from '@ingradient/ui/patterns'

const HEADER_MAIN_STYLE = { minWidth: 0, gap: 'var(--ig-space-1)' }
const HEADER_ACTIONS_STYLE = { position: 'relative' as const }

const OverviewPanel = styled(Panel)`
  flex: 1;
`

const Body = styled.div`
  flex: 1;
  min-height: 0;
  padding: var(--ig-space-7);
  overflow: auto;
  display: flex;
  flex-direction: column;
`

const Placeholder = styled.p`
  ${stateTitleText}
  ${stateCenteredLayout}
  margin: 0;
`

const DATE_BTN_STYLE = {
  padding: 'var(--ig-space-3) var(--ig-space-5)',
  minHeight: 'var(--ig-control-height-md)',
  fontSize: 'var(--ig-font-size-xs)',
  fontWeight: 'var(--ig-font-weight-semibold)',
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
    <OverviewPanel className={className}>
      <PanelHeader>
        <Stack gap="var(--ig-space-1)" style={HEADER_MAIN_STYLE}>
          <PanelTitle>{title}</PanelTitle>
          {hint ? <PanelHint>{hint}</PanelHint> : null}
        </Stack>
        <Inline gap="var(--ig-space-4)" wrap="wrap" data-report-hide style={HEADER_ACTIONS_STYLE}>
          {onResetLayout ? <Button type="button" variant="secondary" onClick={onResetLayout} style={RESET_BTN_STYLE}>Reset</Button> : null}
          <Button type="button" variant="secondary" onClick={onToggleDate} style={DATE_BTN_STYLE}>{dateLabel}</Button>
          {datePopover}
        </Inline>
      </PanelHeader>
      <Body>
        {state === 'no-project' ? <Placeholder>{emptyText}</Placeholder>
          : state === 'loading' ? <Placeholder><Stack gap={3} align="center"><Spinner size="lg" /><span>{loadingText}</span></Stack></Placeholder>
          : state === 'error' ? <Placeholder>{errorMessage ?? 'Error'}</Placeholder>
          : children ? children
          : <Placeholder>{noDataText}</Placeholder>}
      </Body>
    </OverviewPanel>
  )
}
