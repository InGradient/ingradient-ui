import styled from 'styled-components'
import { X } from 'lucide-react'
import type { ConnectionGuidePanelViewProps } from '../types'

const Panel = styled.div`
  position: relative;
  padding: var(--ig-space-5);
  background: var(--ig-color-blue-tint-14, rgba(77, 136, 255, 0.1));
  border: 1px solid rgba(77, 136, 255, 0.34);
  border-radius: var(--ig-radius-sm);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
  margin-bottom: var(--ig-space-5);
`

const StepLabel = styled.div`
  font-size: var(--ig-font-size-2xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ig-color-accent);
`

const Message = styled.div`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-primary);
  line-height: 1.5;
`

const Hint = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
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

export function ConnectionGuidePanelView(props: ConnectionGuidePanelViewProps): JSX.Element {
  const { state, labels, onDismiss } = props
  return (
    <Panel>
      <CloseBtn type="button" onClick={onDismiss}><X size={14} /></CloseBtn>
      <StepLabel>{state.step}</StepLabel>
      <Message>{labels.guideMessages[state.step] || state.message}</Message>
      {state.recoveryHint && <Hint>{state.recoveryHint}</Hint>}
    </Panel>
  )
}
