import { InvitationsTab, OrgMembersTab, SettingsSection } from '@ingradient/ui/patterns'
import type { InvitationsTabProps, OrgMembersTabProps } from '@ingradient/ui/patterns'

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
