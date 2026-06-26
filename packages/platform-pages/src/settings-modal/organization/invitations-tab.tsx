import { Stack } from '@ingradient/ui/primitives'
import { EmptyText as Empty } from '@ingradient/ui/components'
import { SettingsSection } from '@ingradient/ui/patterns'
import {
  InvitationsSection,
  type InvitationsSectionProps,
} from './invitations-section'
import {
  JoinCodesSection,
  type JoinCodesSectionProps,
} from './join-codes-section'

export interface InvitationsTabProps {
  loading?: boolean
  error?: string | null
  invitations: InvitationsSectionProps
  joinCodes: JoinCodesSectionProps
  loadingText?: string
}

export function InvitationsTab({
  loading, error, invitations, joinCodes,
  loadingText = 'Loading…',
}: InvitationsTabProps) {
  if (loading) return <Empty>{loadingText}</Empty>
  if (error) return <Empty>{error}</Empty>
  return (
    <Stack gap="var(--ig-space-4)">
      <SettingsSection title={invitations.title ?? 'Invitations'}>
        <InvitationsSection {...invitations} title="" />
      </SettingsSection>
      <SettingsSection title={joinCodes.title ?? 'Join Codes'}>
        <JoinCodesSection {...joinCodes} title="" />
      </SettingsSection>
    </Stack>
  )
}
