import styled from 'styled-components'
import { Button } from '@ingradient/ui'
import { ProgressBar } from '@ingradient/ui/components'
import type { FieldTestTabViewProps } from '../types'

const Wrap = styled.div`display: flex; flex-direction: column; gap: var(--ig-space-7);`
const Desc = styled.div`font-size: var(--ig-font-size-sm); color: var(--ig-color-text-muted); line-height: var(--ig-line-height-loose);`
const Title = styled.h3`font-size: var(--ig-font-size-md); font-weight: var(--ig-font-weight-bold); margin: 0; color: var(--ig-color-text-primary);`
const LogBox = styled.pre`
  background: var(--ig-color-surface-raised);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  padding: var(--ig-space-4);
  font-family: 'Courier New', monospace;
  font-size: var(--ig-font-size-xs);
  max-height: 320px;
  overflow-y: auto;
  margin: 0;
  white-space: pre-wrap;
`

export function FieldTestTabView(props: FieldTestTabViewProps): JSX.Element {
  const { running, progress, hasResults, log, labels, onRun, onCancel, onReset, onExport } = props
  return (
    <Wrap>
      <Title>{labels.title}</Title>
      <Desc>{labels.description}</Desc>
      <div style={{ display: 'flex', gap: 'var(--ig-space-3)' }}>
        {!running && (
          <Button size="sm" variant="accent" onClick={onRun}>{labels.run}</Button>
        )}
        {running && (
          <Button size="sm" variant="secondary" onClick={onCancel}>{labels.cancel}</Button>
        )}
        <Button size="sm" variant="secondary" onClick={onReset} disabled={running}>{labels.reset}</Button>
        <Button size="sm" variant="secondary" onClick={onExport} disabled={!hasResults}>{labels.export}</Button>
      </div>
      {running && <ProgressBar value={progress * 100} />}
      {log.length > 0
        ? <LogBox>{log.join('\n')}</LogBox>
        : <Desc>{labels.noResults}</Desc>}
    </Wrap>
  )
}
