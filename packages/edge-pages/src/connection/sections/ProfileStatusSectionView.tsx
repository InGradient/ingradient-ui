import { Button, SectionTitle, Spinner } from '@ingradient/ui'
import { FlatSection } from '../ConnectionTabView.styles'
import type { ProfileStatusSectionViewProps } from '../types'

export function ProfileStatusSectionView(props: ProfileStatusSectionViewProps): JSX.Element {
  const { profileName, isLoading, isSaving, labels, onLoad, onSave } = props
  return (
    <FlatSection>
      <SectionTitle>{labels.profileTitle}</SectionTitle>
      <div style={{ display: 'flex', gap: 'var(--ig-space-3)', alignItems: 'center' }}>
        <Button size="sm" variant="secondary" onClick={onLoad} disabled={isLoading}>
          {isLoading && <Spinner size="sm" tone="muted" />}
          {labels.loadProfile}
        </Button>
        <Button size="sm" variant="accent" onClick={onSave} disabled={isSaving}>
          {isSaving && <Spinner size="sm" tone="muted" />}
          {labels.saveProfile}
        </Button>
        {profileName && (
          <span style={{ fontSize: 'var(--ig-font-size-sm)', color: 'var(--ig-color-text-muted)' }}>
            {profileName}
          </span>
        )}
      </div>
    </FlatSection>
  )
}
