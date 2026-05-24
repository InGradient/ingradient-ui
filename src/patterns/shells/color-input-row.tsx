import styled from 'styled-components'
import { Button } from '../../components/inputs/button'

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-5);
`

const NativeColor = styled.input.attrs({ type: 'color' })`
  width: 40px;
  height: 40px;
  padding: 2px;
  border: 1px solid var(--ig-color-border-strong);
  border-radius: var(--ig-radius-xs);
  cursor: pointer;
  background: var(--ig-color-surface-raised);
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  &::-webkit-color-swatch-wrapper { padding: 0; }
  &::-webkit-color-swatch { border: none; border-radius: var(--ig-radius-xs); }
`

const RandomButton = styled(Button).attrs({ variant: 'secondary', size: 'sm' as const })`
  padding: var(--ig-space-3) var(--ig-space-5);
  font-size: 12px;
  line-height: 1;
`

const HexLabel = styled.span`
  font-size: 13px;
  color: var(--ig-color-text-muted);
  font-family: var(--ig-font-mono);
`

export interface ColorInputRowProps {
  value: string
  onChange?: (hex: string) => void
  onRandomize?: () => void
  randomLabel?: string
  ariaLabel?: string
  disabled?: boolean
}

export function ColorInputRow({
  value, onChange, onRandomize,
  randomLabel = 'Random',
  ariaLabel = 'Color',
  disabled,
}: ColorInputRowProps) {
  return (
    <Row>
      <NativeColor
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        aria-label={ariaLabel}
        disabled={disabled}
      />
      <RandomButton type="button" onClick={onRandomize} disabled={disabled}>
        {randomLabel}
      </RandomButton>
      <HexLabel>{value}</HexLabel>
    </Row>
  )
}
