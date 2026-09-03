import { Box, Inline, Text } from '../../primitives'
import { DatePickerField } from '../../components/inputs/date-picker'

const SLOT_STYLE = { flex: 1, minWidth: 0 }

export interface DateRangeFieldProps {
  from: string
  to: string
  onChange: (next: { from: string; to: string }) => void
  fromPlaceholder?: string
  toPlaceholder?: string
  disabled?: boolean
  className?: string
}

export function DateRangeField({
  from, to, onChange,
  fromPlaceholder = 'From date', toPlaceholder = 'To date',
  disabled, className,
}: DateRangeFieldProps) {
  return (
    <Inline gap={2} className={className}>
      <Box style={SLOT_STYLE}>
        <DatePickerField
          value={from}
          onChange={(v) => onChange({ from: v, to })}
          placeholder={fromPlaceholder}
          disabled={disabled}
        />
      </Box>
      <Text tone="muted" size="var(--ig-font-size-sm)">—</Text>
      <Box style={SLOT_STYLE}>
        <DatePickerField
          value={to}
          onChange={(v) => onChange({ from, to: v })}
          placeholder={toPlaceholder}
          disabled={disabled}
        />
      </Box>
    </Inline>
  )
}
