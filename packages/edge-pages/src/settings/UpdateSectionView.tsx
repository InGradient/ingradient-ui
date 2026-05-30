import styled from 'styled-components'
import { Button } from '@ingradient/ui'
import { ProgressBar } from '@ingradient/ui/components'
import type { UpdateSectionViewProps } from './types'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
  padding: var(--ig-space-5);
  background: var(--ig-color-surface-raised);
  border-radius: var(--ig-radius-md);
`
const Title = styled.h3`font-size: var(--ig-font-size-md); font-weight: var(--ig-font-weight-bold); margin: 0; color: var(--ig-color-text-primary);`
const Row = styled.div`display: flex; justify-content: space-between; align-items: center;`
const Label = styled.span`font-size: var(--ig-font-size-sm); color: var(--ig-color-text-muted);`
const Value = styled.span`font-size: var(--ig-font-size-sm); color: var(--ig-color-text-primary); font-weight: var(--ig-font-weight-semibold);`
const ErrorMsg = styled.div`color: var(--ig-color-danger); font-size: var(--ig-font-size-sm);`

export function UpdateSectionView(props: UpdateSectionViewProps): JSX.Element {
  const {
    currentVersion, status, availableVersion, progress, error, labels,
    onCheckForUpdates, onDownloadUpdate, onInstallUpdate,
  } = props

  return (
    <Wrap>
      <Title>{labels.title}</Title>
      <Row>
        <Label>{labels.currentVersion}</Label>
        <Value>{currentVersion}</Value>
      </Row>
      {status === 'idle' && (
        <Button size="sm" variant="secondary" onClick={onCheckForUpdates}>{labels.checkForUpdates}</Button>
      )}
      {status === 'checking' && <Label>{labels.checking}</Label>}
      {status === 'noUpdate' && <Label>{labels.noUpdate}</Label>}
      {status === 'available' && availableVersion && (
        <>
          <div>{labels.available(availableVersion)}</div>
          <Button size="sm" variant="accent" onClick={onDownloadUpdate}>{labels.download}</Button>
        </>
      )}
      {status === 'downloading' && (
        <>
          <Label>{labels.downloading}</Label>
          <ProgressBar value={progress * 100} />
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
