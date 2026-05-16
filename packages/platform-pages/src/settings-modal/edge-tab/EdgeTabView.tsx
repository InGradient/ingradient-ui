import type { ReactNode } from 'react'
import { EmptyState, Tabs } from '@ingradient/ui/components'
import { TabContent } from './edge.styles'

export type EdgeTabKey = 'work' | 'export' | 'import'

export interface EdgeTabViewProps {
  /** projectId 가 null/undefined 면 placeholder 만 표시. */
  projectId?: string | null
  tab: EdgeTabKey
  onTabChange: (next: EdgeTabKey) => void
  /** 각 sub-tab 의 UI 인스턴스. caller 가 `<WorkOptionsTabUI .../>` 등을 미리 구성해 전달. */
  workSlot: ReactNode
  exportSlot: ReactNode
  importSlot: ReactNode
}

const TAB_ITEMS = [
  { value: 'work', label: 'Work Options' },
  { value: 'export', label: 'Export Project File' },
  { value: 'import', label: 'Import Results' },
] as const

/**
 * Settings modal 의 Edge tab shell. Platform 의 `EdgeManagementPanel` 의 pure UI 추출.
 * sub-tab 의 UI 는 slot 으로 받음 — caller 가 hook 연결을 책임.
 */
export function EdgeTabView({
  projectId,
  tab,
  onTabChange,
  workSlot,
  exportSlot,
  importSlot,
}: EdgeTabViewProps) {
  if (!projectId) return <EmptyState>Select a project to manage Edge packages.</EmptyState>

  return (
    <>
      <Tabs
        variant="underline"
        value={tab}
        onChange={(next) => onTabChange(next as EdgeTabKey)}
        items={TAB_ITEMS as unknown as { value: string; label: string }[]}
        style={{ width: '100%' }}
      />
      <TabContent>
        {tab === 'work' && workSlot}
        {tab === 'export' && exportSlot}
        {tab === 'import' && importSlot}
      </TabContent>
    </>
  )
}
