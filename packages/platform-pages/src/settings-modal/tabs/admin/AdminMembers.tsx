import { InvitationsTab, OrgMembersTab } from '../../organization'
import type { InvitationsTabProps, OrgMembersTabProps } from '../../organization'

const INVITATIONS_WRAPPER_STYLE: React.CSSProperties = { marginTop: 24 }

interface Props {
  members: OrgMembersTabProps
  invitations: InvitationsTabProps
}

export function AdminMembers({ members, invitations }: Props) {
  return (
    <>
      <OrgMembersTab {...members} />
      <div style={INVITATIONS_WRAPPER_STYLE}>
        <InvitationsTab {...invitations} />
      </div>
    </>
  )
}
