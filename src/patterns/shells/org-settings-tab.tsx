import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { TextField } from '../../components/inputs/text-fields'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-9);
  max-width: 480px;
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
  gap: var(--ig-space-2);
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
  gap: var(--ig-space-5);
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
  margin: 0;
  color: var(--ig-color-text-soft);
  font-size: 14px;
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
      <SectionTitle>{title}</SectionTitle>

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
          <Button type="button" onClick={onSave} disabled={!!saving || !nameDraft.trim()}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
          {message && <SuccessMsg>{message}</SuccessMsg>}
          {error && <ErrorMsg>{error}</ErrorMsg>}
        </SaveRow>
      )}
    </Wrap>
  )
}
