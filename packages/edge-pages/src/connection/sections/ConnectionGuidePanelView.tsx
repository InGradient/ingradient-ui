import { Activity, AlertTriangle, CheckCircle, Search, SlidersHorizontal, Wifi, X } from 'lucide-react'
import styled from 'styled-components'
import { Badge, Button, iconSizeNumbers, surfacePanel, surfaceRaised } from '@ingradient/ui'
import type { ConnectionGuidePanelViewProps, GuideTone } from '../types'

const GuideCard = styled.div`
  ${surfacePanel}
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--ig-space-5);
  align-items: start;
  padding: var(--ig-space-5);
  border-radius: var(--ig-radius-xs);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  margin-bottom: var(--ig-space-7);
  position: relative;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  margin-bottom: var(--ig-space-2);
`

const Title = styled.div`
  font-size: var(--ig-font-size-lg);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
`

const Summary = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-secondary);
  line-height: var(--ig-line-height-relaxed);
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--ig-space-3);
  flex-wrap: wrap;
`

const SummaryGrid = styled.div`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--ig-space-3);
  margin-top: var(--ig-space-3);
`

const SummaryItem = styled.div`
  ${surfaceRaised}
  padding: var(--ig-space-3) var(--ig-space-4);
  border-radius: var(--ig-radius-xs);
  min-width: 0;
`

const SummaryLabel = styled.div`
  font-size: var(--ig-font-size-2xs);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-wide);
  color: var(--ig-color-text-muted);
  margin-bottom: var(--ig-space-1);
`

const SummaryValue = styled.div`
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Warnings = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-1);
  margin-top: var(--ig-space-3);
`

const Warning = styled.div`
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-warning);
  line-height: var(--ig-line-height-snug);
`

const CloseBtn = styled.button`
  position: absolute;
  top: var(--ig-space-3);
  right: var(--ig-space-3);
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--ig-color-text-muted);
`

function toneColor(tone: GuideTone): string {
  switch (tone) {
    case 'success': return 'var(--ig-color-success)'
    case 'warning': return 'var(--ig-color-warning)'
    case 'danger':  return 'var(--ig-color-danger)'
    case 'accent':  return 'var(--ig-color-accent-soft)'
    case 'neutral': return 'var(--ig-color-text-muted)'
  }
}

function StatusIcon({ tone }: { tone: GuideTone }): JSX.Element {
  const color = toneColor(tone)
  const size = iconSizeNumbers.md
  if (tone === 'success') return <CheckCircle size={size} color={color} />
  if (tone === 'danger')  return <AlertTriangle size={size} color={color} />
  if (tone === 'warning') return <SlidersHorizontal size={size} color={color} />
  if (tone === 'accent')  return <Activity size={size} color={color} />
  return <Wifi size={size} color={color} />
}

function valueOrDash(value: string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
  return value
}

export function ConnectionGuidePanelView(props: ConnectionGuidePanelViewProps): JSX.Element {
  const { state, labels, onDismiss } = props
  const { tone, statusLabel, title, summary, primaryAction, secondaryActions, network, warnings } = state

  return (
    <GuideCard>
      {onDismiss && (
        <CloseBtn type="button" onClick={onDismiss}>
          <X size={iconSizeNumbers.sm} />
        </CloseBtn>
      )}

      <div>
        <Header>
          <StatusIcon tone={tone} />
          <Title>{title}</Title>
          <Badge $tone={tone}>{statusLabel}</Badge>
        </Header>
        <Summary>{summary}</Summary>
      </div>

      <Actions>
        {secondaryActions?.map((action, i) => (
          <Button key={`${action.label}-${i}`} size="sm" variant="secondary" type="button" onClick={action.onClick}>
            {action.label}
          </Button>
        ))}
        <Button size="sm" type="button" onClick={primaryAction.onClick}>
          {primaryAction.label === labels.scan
            ? <Search size={iconSizeNumbers.xs} />
            : <Activity size={iconSizeNumbers.xs} />}
          {primaryAction.label}
        </Button>
      </Actions>

      <SummaryGrid>
        <SummaryItem>
          <SummaryLabel>{labels.guideNetworkCameraIp}</SummaryLabel>
          <SummaryValue>{valueOrDash(network.cameraIp)}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>{labels.guideNetworkNicIp}</SummaryLabel>
          <SummaryValue>{valueOrDash(network.nicIp)}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>{labels.guideNetworkJumbo}</SummaryLabel>
          <SummaryValue>{valueOrDash(network.jumbo)}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>{labels.guideNetworkReceive}</SummaryLabel>
          <SummaryValue>{valueOrDash(network.receive)}</SummaryValue>
        </SummaryItem>
      </SummaryGrid>

      {warnings && warnings.length > 0 && (
        <Warnings>
          {warnings.map((w, i) => <Warning key={`${w}-${i}`}>{w}</Warning>)}
        </Warnings>
      )}
    </GuideCard>
  )
}
