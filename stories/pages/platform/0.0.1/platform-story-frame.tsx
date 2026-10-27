import type { ReactNode } from 'react'
import { fn } from 'storybook/test'
import { PlatformAppShell } from '@ingradient/platform-pages'

/** Story-time navigation is recorded in the Actions panel; the product app performs it. */
const onNavigate = fn().mockName('onNavigate')
const onOpenProjects = fn().mockName('onOpenProjects')
const onOpenSettings = fn().mockName('onOpenSettings')
const onSignOut = fn().mockName('onSignOut')

export const STORY_PROJECT_NAME = 'Wafer-2026'

/**
 * Wraps a Platform workspace page in the product app shell, exactly as the app's route layout
 * does, so stories review the page at its real width next to the app-wide sidebar.
 */
export function PlatformStoryFrame({
  activeKey,
  projectName = STORY_PROJECT_NAME,
  children,
}: {
  activeKey: 'dashboard' | 'catalog' | 'classes'
  projectName?: string
  children: ReactNode
}) {
  return (
    <PlatformAppShell
      activeKey={activeKey}
      onNavigate={onNavigate}
      projectName={projectName}
      onOpenProjects={onOpenProjects}
      onOpenSettings={onOpenSettings}
      onSignOut={onSignOut}
    >
      {children}
    </PlatformAppShell>
  )
}
