import type { ReactNode } from 'react'
import styled from 'styled-components'
import { PageHeader, PageSubtitle, PageTitle } from '../page/page-shell'

const Top = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`

const Subtitle = styled(PageSubtitle)`
  margin-top: 6px;
`

const ProjectName = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: var(--ig-color-text-secondary);
  text-align: right;
  flex-shrink: 0;
  margin-left: auto;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  position: relative;
  justify-content: flex-end;
  padding: 8px 24px;
`

const Message = styled.span`
  font-size: 12px;
  color: var(--ig-color-text-soft);
`

export interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  projectName?: string | null
  saveMessage?: string | null
  actions?: ReactNode
  /** Customize popover 등 actions 우측에 띄울 컨텐츠 */
  actionsExtra?: ReactNode
  className?: string
}

export function DashboardHeader({
  title = 'Dashboard',
  subtitle = 'Watch project labeling status and dataset progress in one place.',
  projectName,
  saveMessage,
  actions,
  actionsExtra,
  className,
}: DashboardHeaderProps) {
  return (
    <div className={className}>
      <PageHeader>
        <Top>
          <div>
            <PageTitle>{title}</PageTitle>
            {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
          </div>
          {projectName ? <ProjectName>{projectName}</ProjectName> : null}
        </Top>
      </PageHeader>
      {(actions || saveMessage) ? (
        <Actions data-report-hide>
          {saveMessage ? <Message>{saveMessage}</Message> : null}
          {actions}
          {actionsExtra}
        </Actions>
      ) : null}
    </div>
  )
}
