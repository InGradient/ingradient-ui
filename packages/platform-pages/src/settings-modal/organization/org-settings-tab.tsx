import styled from 'styled-components'
import { Inline, Stack, Text, stateCenteredLayout, stateTitleText } from '@ingradient/ui/primitives'
import { Button } from '@ingradient/ui/components'
import { TextField } from '@ingradient/ui/components'

const WRAP_STYLE = { maxWidth: 480 }

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
    <Stack gap="var(--ig-space-9)" style={WRAP_STYLE}>
      <Text as="h3" size="var(--ig-font-size-xl)" weight={600}>{title}</Text>

      <Stack gap="var(--ig-space-2)">
        <Text as="label" size="var(--ig-font-size-sm)" weight={500}>Code</Text>
        <Text size="var(--ig-font-size-md)" tone="muted">{organization.code}</Text>
      </Stack>

      <Stack gap="var(--ig-space-2)">
        <Text as="label" htmlFor="org-name-input" size="var(--ig-font-size-sm)" weight={500}>Name</Text>
        {isAdmin ? (
          <TextField
            id="org-name-input"
            value={nameDraft}
            onChange={(e) => onChangeNameDraft(e.target.value)}
            placeholder="Organization name"
            title="Organization name"
          />
        ) : (
          <Text size="var(--ig-font-size-md)" tone="muted">{organization.name}</Text>
        )}
      </Stack>

      <Stack gap="var(--ig-space-2)">
        <Text as="label" size="var(--ig-font-size-sm)" weight={500}>Status</Text>
        <Text size="var(--ig-font-size-md)" tone="muted">{organization.status}</Text>
      </Stack>

      {isAdmin && (
        <Inline gap="var(--ig-space-5)">
          <Button type="button" onClick={onSave} disabled={!!saving || !nameDraft.trim()}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
          {message && <Text size="var(--ig-font-size-sm)" tone="success">{message}</Text>}
          {error && <Text size="var(--ig-font-size-sm)" tone="danger">{error}</Text>}
        </Inline>
      )}
    </Stack>
  )
}
