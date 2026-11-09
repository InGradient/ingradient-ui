import styled from 'styled-components'
import { withSurfaceDepth, Stack } from '@ingradient/ui/primitives'
import { Button } from '@ingradient/ui'
import { ProgressBar } from '@ingradient/ui/components'
import type { FieldTestTabViewProps } from '../types'

const Desc = styled.div`font-size: var(--ig-text-body-sm); color: var(--ig-color-text-muted); line-height: var(--ig-text-body-sm-leading);`
const Title = styled.h3`font-size: var(--ig-text-body);
  line-height: var(--ig-text-body-leading); font-weight: var(--ig-font-weight-bold); margin: 0; color: var(--ig-color-text-primary);`
const LogBoxBase = styled.pre`
  background: var(--ig-color-surface-raised);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  padding: calc(var(--ig-spacing-8) - var(--ig-border-1px));
  font-family: var(--ig-font-mono);
  font-size: var(--ig-text-caption);
  line-height: var(--ig-text-caption-leading);
  max-height: var(--ig-popup-md);
  overflow-y: auto;
  margin: 0;
  white-space: pre-wrap;
`
const LogBox = withSurfaceDepth(LogBoxBase, { displayName: 'LogBox' })

export function FieldTestTabView(props: FieldTestTabViewProps): JSX.Element {
  const { running, progress, hasResults, log, labels, onRun, onCancel, onReset, onExport } = props
  return (
    <Stack gap="var(--ig-spacing-16)">
      <Title>{labels.title}</Title>
      <Desc>{labels.description}</Desc>
      <div style={{ display: 'flex', gap: 'var(--ig-spacing-8)' }}>
        {!running && (
          <Button size="sm" variant="solid" onClick={onRun}>{labels.run}</Button>
        )}
        {running && (
          <Button size="sm" variant="secondary" onClick={onCancel}>{labels.cancel}</Button>
        )}
        <Button size="sm" variant="secondary" onClick={onReset} disabled={running}>{labels.reset}</Button>
        <Button size="sm" variant="secondary" onClick={onExport} disabled={!hasResults}>{labels.export}</Button>
      </div>
      {running && <ProgressBar value={progress * 100} aria-label={labels.running} />}
      {log.length > 0
        ? <LogBox tabIndex={0} role="region" aria-label={labels.title}>{log.join('\n')}</LogBox>
        : <Desc>{labels.noResults}</Desc>}
    </Stack>
  )
}
