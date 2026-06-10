import styled from 'styled-components'
import { stateCenteredLayout, stateTitleText } from '../../primitives'
import {
  InvitationsSection,
  type InvitationsSectionProps,
} from './invitations-section'
import {
  JoinCodesSection,
  type JoinCodesSectionProps,
} from './join-codes-section'
import { SettingsSection } from './settings-section'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

const Empty = styled.p`
  ${stateTitleText}
  ${stateCenteredLayout}
  margin: 0;
`

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
    <Wrap>
      <SettingsSection title={invitations.title ?? 'Invitations'}>
        <InvitationsSection {...invitations} title="" />
      </SettingsSection>
      <SettingsSection title={joinCodes.title ?? 'Join Codes'}>
        <JoinCodesSection {...joinCodes} title="" />
      </SettingsSection>
    </Wrap>
  )
}
