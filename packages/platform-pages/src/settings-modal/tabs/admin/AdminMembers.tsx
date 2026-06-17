import { SettingsSection } from '@ingradient/ui/patterns'
import { InvitationsTab, OrgMembersTab } from '../../organization'
import type { InvitationsTabProps, OrgMembersTabProps } from '../../organization'

interface Props {
  members: OrgMembersTabProps
  invitations: InvitationsTabProps
}

export function AdminMembers({ members, invitations }: Props) {
  return (
    <>
      <SettingsSection title={members.title ?? 'Members'}>
        <OrgMembersTab {...members} title="" />
      </SettingsSection>
      <InvitationsTab {...invitations} />
    </>
  )
}
