import styled from 'styled-components'
import { Inline, Text } from '../../primitives'
import { Button } from '../../components/inputs/button'

const NativeColor = styled.input.attrs({ type: 'color' })`
  width: 40px;
  height: 40px;
  padding: 2px;
  border: 1px solid var(--ig-color-border-strong);
  border-radius: var(--ig-radius-xxs);
  cursor: pointer;
  background: var(--ig-color-surface-raised);
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  &::-webkit-color-swatch-wrapper { padding: 0; }
  &::-webkit-color-swatch { border: none; border-radius: var(--ig-radius-2xs); }
`

const RANDOM_BTN_STYLE = {
  padding: 'var(--ig-space-3) var(--ig-space-5)',
  fontSize: 12,
  lineHeight: 1,
}

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
    <Inline gap={5}>
      <NativeColor
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        aria-label={ariaLabel}
        disabled={disabled}
      />
      <Button type="button" variant="secondary" size="sm" onClick={onRandomize} disabled={disabled} style={RANDOM_BTN_STYLE}>
        {randomLabel}
      </Button>
      <Text as="span" size="13px" tone="muted" fontFamily="mono">{value}</Text>
    </Inline>
  )
}
