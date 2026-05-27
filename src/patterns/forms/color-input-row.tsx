import { Inline, Text } from '../../primitives'
import { Button } from '../../components/inputs/button'
import { ColorInput } from '../../components/inputs/color-input'

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
      <ColorInput
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
