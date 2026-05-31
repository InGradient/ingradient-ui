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

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
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
      <InvitationsSection {...invitations} />
      <JoinCodesSection {...joinCodes} />
    </Wrap>
  )
}
