import { DialogCloseButton, ModalBackdrop } from '@ingradient/ui/components'
import {
  Body,
  Header,
  Main,
  Modal,
  TabsList,
  Title,
} from './SettingsModalView.styles'
import { AccountTab } from './tabs/AccountTab'
import { AdminTab } from './tabs/AdminTab'
import { EdgeTab } from './tabs/EdgeTab'
import { EdgeTabView } from './edge-tab'
import { GeneralTab } from './tabs/GeneralTab'
import { ProjectTab } from './tabs/ProjectTab'
import type { SettingsModalViewProps, SettingsTab } from './types'

const BASE_TABS: Array<{ value: SettingsTab; label: string }> = [
  { value: 'general', label: 'General' },
  { value: 'account', label: 'Account' },
  { value: 'project', label: 'Project' },
  { value: 'edge', label: 'Edge' },
]

const ADMIN_TAB = { value: 'admin' as SettingsTab, label: 'Admin' }

export function SettingsModalView({
  open,
  onClose,
  tab,
  onTabChange,
  isAdmin,
  general,
  account,
  project,
  edge,
  admin,
}: SettingsModalViewProps) {
  if (!open) return null
  const tabs = isAdmin ? [...BASE_TABS, ADMIN_TAB] : BASE_TABS
  return (
    <ModalBackdrop>
      <Modal>
        <Header>
          <Title>Settings</Title>
          <DialogCloseButton onClick={onClose} />
        </Header>
        <Main>
          <TabsList
            items={tabs}
            value={tab}
            onChange={(v) => onTabChange(v as SettingsTab)}
            radius="xs"
          />
          <Body>
            {tab === 'general' ? <GeneralTab {...general} /> : null}
            {tab === 'account' ? <AccountTab {...account} /> : null}
            {tab === 'project' ? <ProjectTab {...project} /> : null}
            {tab === 'edge' ? (
              edge ? (
                <EdgeTabView
                  projectId={edge.projectId}
                  tab={edge.subTab}
                  onTabChange={edge.onSubTabChange}
                  workSlot={edge.workSlot}
                  exportSlot={edge.exportSlot}
                  importSlot={edge.importSlot}
                />
              ) : (
                <EdgeTab />
              )
            ) : null}
            {tab === 'admin' && admin ? <AdminTab {...admin} /> : null}
          </Body>
        </Main>
      </Modal>
    </ModalBackdrop>
  )
}
