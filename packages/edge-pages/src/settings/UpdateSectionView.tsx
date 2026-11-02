import styled from 'styled-components'
import { withSurfaceDepth, Text } from '@ingradient/ui/primitives'
import { Button } from '@ingradient/ui'
import { KeyValueRow, ProgressBar } from '@ingradient/ui/components'
import type { UpdateSectionViewProps } from './types'

const WrapBase = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-spacing-8);
  padding: var(--ig-spacing-12);
  background: var(--ig-color-surface-raised);
  border-radius: var(--ig-radius-md);
`
const Wrap = withSurfaceDepth(WrapBase, { displayName: 'Wrap' })
const Title = styled.h3`font-size: var(--ig-text-body); font-weight: var(--ig-font-weight-bold); margin: 0; color: var(--ig-color-text-primary);`
const ErrorMsg = styled.div`color: var(--ig-color-danger); font-size: var(--ig-text-body-sm);`

export function UpdateSectionView(props: UpdateSectionViewProps): JSX.Element {
  const {
    currentVersion, status, availableVersion, progress, error, labels,
    onCheckForUpdates, onDownloadUpdate, onInstallUpdate,
  } = props

  return (
    <Wrap>
      <Title>{labels.title}</Title>
      <KeyValueRow label={labels.currentVersion} value={currentVersion} />
      {status === 'idle' && (
        <Button size="sm" variant="secondary" onClick={onCheckForUpdates}>{labels.checkForUpdates}</Button>
      )}
      {status === 'checking' && <Text size="var(--ig-text-body-sm)" tone="muted">{labels.checking}</Text>}
      {status === 'noUpdate' && <Text size="var(--ig-text-body-sm)" tone="muted">{labels.noUpdate}</Text>}
      {status === 'available' && availableVersion && (
        <>
          <div>{labels.available(availableVersion)}</div>
          <Button size="sm" variant="accent" onClick={onDownloadUpdate}>{labels.download}</Button>
        </>
      )}
      {status === 'downloading' && (
        <>
          <Text size="var(--ig-text-body-sm)" tone="muted">{labels.downloading}</Text>
          <ProgressBar value={progress * 100} aria-label={labels.downloading} />
        </>
      )}
      {status === 'downloaded' && (
        <>
          <div>{labels.downloaded}</div>
          <Button size="sm" variant="accent" onClick={onInstallUpdate}>{labels.install}</Button>
        </>
      )}
      {status === 'error' && <ErrorMsg>{error ?? labels.error}</ErrorMsg>}
    </Wrap>
  )
}
