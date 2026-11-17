import styled from 'styled-components'
import { Card } from '@ingradient/ui'
import { Button, ProgressBar } from '@ingradient/ui/components'
import { Inline, Text } from '@ingradient/ui/primitives'
import { MetricLabel, MetricValue } from './CaptureView.styles'
import type { FringeContrastCardViewProps } from './types'

const Wide = styled.div`
  grid-column: 1 / -1;
`

/**
 * Setup preview "Fringe contrast": with the tuning stripes on screen it shows contrast inside the part,
 * the best value while adjusting focus/lighting/monitor, and progress toward the training target.
 */
export function FringeContrastCardView({ contrast, best, isStripe, labels: l, onResetBest }: FringeContrastCardViewProps): JSX.Element {
  const pct = contrast?.target ? Math.round((contrast.value / contrast.target) * 100) : null
  return (
    <Wide>
      <Card elevation="raised" flat padding="var(--ig-spacing-8) var(--ig-spacing-8)">
        <MetricLabel>{l.title}</MetricLabel>
        {!isStripe && <Text as="div" size="var(--ig-text-micro)" tone="muted">{l.hint}</Text>}
        {isStripe && !contrast && <Text as="div" size="var(--ig-text-micro)" tone="muted">{l.none}</Text>}
        {isStripe && contrast && (
          <>
            <Inline gap="var(--ig-spacing-8)" align="center" wrap="nowrap">
              <MetricValue>{contrast.value.toFixed(3)}</MetricValue>
              <Text size="var(--ig-text-micro)" tone="secondary" tabularNums>{l.best(best == null ? '-' : best.toFixed(3))}</Text>
              <Button variant="secondary" size="sm" type="button" onClick={onResetBest} style={{ marginLeft: 'auto' }}>{l.resetBest}</Button>
            </Inline>
            {contrast.target != null && pct != null ? (
              <Inline gap="var(--ig-spacing-8)" align="center" wrap="nowrap">
                <div style={{ flex: 1 }}><ProgressBar value={Math.min(100, pct)} size="sm" ariaLabel={l.target(pct, contrast.target)} /></div>
                <Text size="var(--ig-text-micro)" tone="secondary" tabularNums>{l.target(pct, contrast.target)}</Text>
              </Inline>
            ) : (
              <Text as="div" size="var(--ig-text-micro)" tone="secondary">{l.noTarget}</Text>
            )}
          </>
        )}
      </Card>
    </Wide>
  )
}
