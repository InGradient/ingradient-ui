import type { ReactNode } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { Spinner } from '../../components/feedback/spinner'
import { Stack, stateCenteredLayout, stateTitleText } from '../../primitives'
import { Panel, PanelHeader, PanelHint, PanelTitle } from '../page/page-shell'

const HeaderMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  flex-wrap: wrap;
`

const DateButton = styled(Button).attrs({ variant: 'secondary' as const })`
  padding: 8px 12px;
  min-height: 36px;
  font-size: 12px;
  font-weight: 600;
`

const ResetButton = styled(DateButton)`
  min-width: 0;
`

const OverviewPanel = styled(Panel)`
  flex: 1;
`

const Body = styled.div`
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow: visible;
  display: flex;
  flex-direction: column;
`

const Placeholder = styled.p`
  ${stateTitleText}
  ${stateCenteredLayout}
  margin: 0;
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
    <OverviewPanel className={className}>
      <PanelHeader>
        <HeaderMain>
          <PanelTitle>{title}</PanelTitle>
          {hint ? <PanelHint>{hint}</PanelHint> : null}
        </HeaderMain>
        <HeaderActions data-report-hide>
          {onResetLayout ? <ResetButton type="button" onClick={onResetLayout}>Reset</ResetButton> : null}
          <DateButton type="button" onClick={onToggleDate}>{dateLabel}</DateButton>
          {datePopover}
        </HeaderActions>
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
