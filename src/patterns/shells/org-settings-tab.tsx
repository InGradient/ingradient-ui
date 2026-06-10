import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { TextField } from '../../components/inputs/text-fields'
import { stateCenteredLayout, stateTitleText } from '../../primitives'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
  width: 100%;
`

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--ig-color-text-primary);
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: var(--ig-color-text-primary);
`

const FieldValue = styled.div`
  font-size: 14px;
  color: var(--ig-color-text-muted);
`

const SaveRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--ig-space-4);
`

const SuccessMsg = styled.span`
  font-size: 13px;
  color: var(--ig-color-success);
`

const ErrorMsg = styled.span`
  font-size: 13px;
  color: var(--ig-color-danger);
`

const Placeholder = styled.p`
  ${stateTitleText}
  ${stateCenteredLayout}
  margin: 0;
`

export interface OrgSettingsTabProps {
  /** 조직 정보 (null/undefined → 로딩 placeholder) */
  organization: { code: string; name: string; status: string } | null
  /** 조직이 아예 없을 때 (admin 권한 없을 수도) */
  noOrganization?: boolean
  isAdmin?: boolean
  nameDraft: string
  onChangeNameDraft: (value: string) => void
  saving?: boolean
  message?: string | null
  error?: string | null
  onSave: () => void
  title?: string
  noOrgText?: string
  loadingText?: string
}

export function OrgSettingsTab({
  organization, noOrganization, isAdmin,
  nameDraft, onChangeNameDraft, saving, message, error, onSave,
  title = 'Organization',
  noOrgText = 'No organization',
  loadingText = 'Loading…',
}: OrgSettingsTabProps) {
  if (noOrganization) return <Placeholder>{noOrgText}</Placeholder>
  if (!organization) return <Placeholder>{loadingText}</Placeholder>

  return (
    <Wrap>
      {title ? <SectionTitle>{title}</SectionTitle> : null}

      <Field>
        <FieldLabel>Code</FieldLabel>
        <FieldValue>{organization.code}</FieldValue>
      </Field>

      <Field>
        <FieldLabel htmlFor="org-name-input">Name</FieldLabel>
        {isAdmin ? (
          <TextField
            id="org-name-input"
            value={nameDraft}
            onChange={(e) => onChangeNameDraft(e.target.value)}
            placeholder="Organization name"
            title="Organization name"
          />
        ) : (
          <FieldValue>{organization.name}</FieldValue>
        )}
      </Field>

      <Field>
        <FieldLabel>Status</FieldLabel>
        <FieldValue>{organization.status}</FieldValue>
      </Field>

      {isAdmin && (
        <SaveRow>
          {message && <SuccessMsg>{message}</SuccessMsg>}
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <Button type="button" onClick={onSave} disabled={!!saving || !nameDraft.trim()}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </SaveRow>
      )}
    </Wrap>
  )
}
