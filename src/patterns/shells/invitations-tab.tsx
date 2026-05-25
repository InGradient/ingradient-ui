import { Stack, Text } from '../../primitives'
import {
  InvitationsSection,
  type InvitationsSectionProps,
} from './invitations-section'
import {
  JoinCodesSection,
  type JoinCodesSectionProps,
} from './join-codes-section'

const EMPTY_STYLE = { margin: 'var(--ig-space-7) 0 0' }

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
  if (loading) return <Text as="p" tone="muted" align="center" size="13px" style={EMPTY_STYLE}>{loadingText}</Text>
  if (error) return <Text as="p" tone="muted" align="center" size="13px" style={EMPTY_STYLE}>{error}</Text>
  return (
    <Stack gap={13}>
      <InvitationsSection {...invitations} />
      <JoinCodesSection {...joinCodes} />
    </Stack>
  )
}
