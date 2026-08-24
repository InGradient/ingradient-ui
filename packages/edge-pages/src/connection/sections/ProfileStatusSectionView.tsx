import { Button, SectionTitle, Spinner } from '@ingradient/ui'
import { Inline, Stack, Text } from '@ingradient/ui/primitives'
import type { ProfileStatusSectionViewProps } from '../types'

export function ProfileStatusSectionView(props: ProfileStatusSectionViewProps): JSX.Element {
  const { profileName, isLoading, isSaving, labels, onLoad, onSave } = props
  return (
    <Stack as="section" gap="var(--ig-space-5)" style={{ marginBottom: 'var(--ig-space-7)' }}>
      <SectionTitle>{labels.profileTitle}</SectionTitle>
      <Inline gap="var(--ig-space-3)" align="center" wrap="nowrap">
        <Button size="sm" variant="secondary" onClick={onLoad} disabled={isLoading}>
          {isLoading && <Spinner size="sm" tone="muted" />}
          {labels.loadProfile}
        </Button>
        <Button size="sm" variant="accent" onClick={onSave} disabled={isSaving}>
          {isSaving && <Spinner size="sm" tone="muted" />}
          {labels.saveProfile}
        </Button>
        {profileName && (
          <Text size="var(--ig-font-size-sm)" tone="muted">
            {profileName}
          </Text>
        )}
      </Inline>
    </Stack>
  )
}
