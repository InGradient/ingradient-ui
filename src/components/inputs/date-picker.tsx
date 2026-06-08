import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { format, parse, isValid } from 'date-fns'
import { svgStrokeWidths } from '../../tokens/core'
import { Placeholder, Popover, Trigger } from './date-picker.styles'
import { FloatingPanelField } from './floating-panel-field'

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={svgStrokeWidths.thin} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 'var(--ig-opacity-muted)' }}>
    <rect x="1" y="2" width="12" height="11" rx="2" />
    <path d="M1 5.5h12M4.5 1v2M9.5 1v2" />
  </svg>
)

export interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DatePickerField({
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  const selected = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined
  const displayValue = selected && isValid(selected) ? format(selected, 'yyyy-MM-dd') : ''

  const handleSelect = (day: Date | undefined) => {
    if (day) onChange(format(day, 'yyyy-MM-dd'))
    setOpen(false)
  }

  return (
    <FloatingPanelField
      open={open}
      onOpenChange={setOpen}
      className={className}
      estimatedHeight={320}
      trigger={
        <Trigger type="button" disabled={disabled} onClick={() => setOpen(!open)}>
          {displayValue || <Placeholder>{placeholder}</Placeholder>}
          <CalendarIcon />
        </Trigger>
      }
    >
      {({ ref, style }) => (
        <Popover ref={ref} style={style}>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            showOutsideDays
          />
        </Popover>
      )}
    </FloatingPanelField>
  )
}
