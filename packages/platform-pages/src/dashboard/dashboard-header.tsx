import type { ReactNode } from 'react'
import { Inline, Text } from '@ingradient/ui/primitives'
import { PageHeader, PageSubtitle, PageTitle } from '@ingradient/ui/patterns'

const SUBTITLE_STYLE = { marginTop: 'var(--ig-space-2)' }
const PROJECT_NAME_STYLE = { textAlign: 'right' as const, flexShrink: 0, marginLeft: 'auto' }
const ACTIONS_STYLE = {
  position: 'relative' as const,
  padding: 'var(--ig-space-3) var(--ig-space-11)',
}

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
        <Inline justify="space-between" align="flex-start" gap={7} wrap="wrap">
          <div>
            <PageTitle>{title}</PageTitle>
            {subtitle ? <PageSubtitle style={SUBTITLE_STYLE}>{subtitle}</PageSubtitle> : null}
          </div>
          {projectName ? <Text size="18px" weight={700} tone="secondary" style={PROJECT_NAME_STYLE}>{projectName}</Text> : null}
        </Inline>
      </PageHeader>
      {(actions || saveMessage) ? (
        <Inline gap={4} wrap="wrap" justify="flex-end" data-report-hide style={ACTIONS_STYLE}>
          {saveMessage ? <Text size="12px" tone="soft">{saveMessage}</Text> : null}
          {actions}
          {actionsExtra}
        </Inline>
      ) : null}
    </div>
  )
}
