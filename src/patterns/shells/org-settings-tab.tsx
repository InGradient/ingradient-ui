import { Inline, Stack, Text } from '../../primitives'
import { Button } from '../../components/inputs/button'
import { TextField } from '../../components/inputs/text-fields'

const WRAP_STYLE = { maxWidth: 480 }
const PLACEHOLDER_STYLE = { margin: 0 }

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
  if (noOrganization) return <Text as="p" tone="soft" size="14px" style={PLACEHOLDER_STYLE}>{noOrgText}</Text>
  if (!organization) return <Text as="p" tone="soft" size="14px" style={PLACEHOLDER_STYLE}>{loadingText}</Text>

  return (
    <Stack gap={9} style={WRAP_STYLE}>
      <Text as="h3" size="16px" weight={600}>{title}</Text>

      <Stack gap={2}>
        <Text as="label" size="13px" weight={500}>Code</Text>
        <Text size="14px" tone="muted">{organization.code}</Text>
      </Stack>

      <Stack gap={2}>
        <Text as="label" htmlFor="org-name-input" size="13px" weight={500}>Name</Text>
        {isAdmin ? (
          <TextField
            id="org-name-input"
            value={nameDraft}
            onChange={(e) => onChangeNameDraft(e.target.value)}
            placeholder="Organization name"
            title="Organization name"
          />
        ) : (
          <Text size="14px" tone="muted">{organization.name}</Text>
        )}
      </Stack>

      <Stack gap={2}>
        <Text as="label" size="13px" weight={500}>Status</Text>
        <Text size="14px" tone="muted">{organization.status}</Text>
      </Stack>

      {isAdmin && (
        <Inline gap={5}>
          <Button type="button" onClick={onSave} disabled={!!saving || !nameDraft.trim()}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
          {message && <Text size="13px" tone="success">{message}</Text>}
          {error && <Text size="13px" tone="danger">{error}</Text>}
        </Inline>
      )}
    </Stack>
  )
}
