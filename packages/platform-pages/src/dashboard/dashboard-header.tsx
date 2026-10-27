import styled from 'styled-components'
import type { ReactNode } from 'react'
import { Inline, Text } from '@ingradient/ui/primitives'
import { PageHeader, PageSubtitle, PageTitle } from '@ingradient/ui/patterns'

const SubtitleBox = styled(PageSubtitle)`
  margin-top: var(--ig-spacing-8);
`
const ProjectNameBox = styled(Text)`
  text-align: right;
  flex-shrink: 0;
  margin-left: auto;
`
const ActionsBox = styled(Inline)`
  position: relative;
  padding: var(--ig-spacing-8) var(--ig-spacing-24);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
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
        <Inline justify="space-between" align="flex-start" gap="var(--ig-spacing-16)" wrap="wrap">
          <div>
            <PageTitle>{title}</PageTitle>
            {subtitle ? <SubtitleBox>{subtitle}</SubtitleBox> : null}
          </div>
          {projectName ? <ProjectNameBox size="var(--ig-text-title)" weight="bold" tone="secondary">{projectName}</ProjectNameBox> : null}
        </Inline>
      </PageHeader>
      {(actions || saveMessage) ? (
        <ActionsBox gap="var(--ig-spacing-8)" wrap="wrap" justify="flex-end" data-report-hide>
          {saveMessage ? <Text size="var(--ig-text-caption)" tone="soft">{saveMessage}</Text> : null}
          {actions}
          {actionsExtra}
        </ActionsBox>
      ) : null}
    </div>
  )
}
