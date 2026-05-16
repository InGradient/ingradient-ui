import { Tabs } from '@ingradient/ui/components'
import { AdminDevices } from './admin/AdminDevices'
import { AdminMembers } from './admin/AdminMembers'
import { AdminOrganization } from './admin/AdminOrganization'
import { AdminStorage } from './admin/AdminStorage'
import {
  AdminBody,
  AdminContent,
  AdminDesc,
  AdminSubTabsWrap,
} from '../SettingsModalView.styles'
import type { AdminSubTab, AdminTabProps } from '../types'

const ADMIN_SUB_TABS = [
  { value: 'organization', label: 'Organization' },
  { value: 'members-invitations', label: 'Members' },
  { value: 'devices', label: 'Devices' },
  { value: 'storage', label: 'Storage' },
]

const ADMIN_DESC: Record<AdminSubTab, string> = {
  'organization': "Manage your organization's name and general settings.",
  'members-invitations':
    'View and manage organization members, their roles, and send invitations to new members.',
  'devices': 'View and manage Edge devices registered to your organization.',
  'storage': 'Analyze image storage and bandwidth usage for cost optimization.',
}

export function AdminTab({
  subTab,
  onSubTabChange,
  organization,
  orgMembers,
  invitations,
  devicesLicense,
  devicesForms,
  devicesTable,
  storage,
}: AdminTabProps) {
  return (
    <AdminBody>
      <AdminSubTabsWrap>
        <Tabs
          items={ADMIN_SUB_TABS}
          value={subTab}
          onChange={(v) => onSubTabChange(v as AdminSubTab)}
          variant="underline"
        />
      </AdminSubTabsWrap>
      <AdminContent>
        <AdminDesc>{ADMIN_DESC[subTab]}</AdminDesc>
        {subTab === 'organization' ? <AdminOrganization {...organization} /> : null}
        {subTab === 'members-invitations' ? (
          <AdminMembers members={orgMembers} invitations={invitations} />
        ) : null}
        {subTab === 'devices' ? (
          <AdminDevices license={devicesLicense} forms={devicesForms} table={devicesTable} />
        ) : null}
        {subTab === 'storage' ? <AdminStorage {...storage} /> : null}
      </AdminContent>
    </AdminBody>
  )
}
