import React from 'react'
import styled from 'styled-components'
import { DatePickerField } from './date-picker'

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
`

const Dash = styled.span`
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-sm);
`

const PickerSlot = styled.div`
  flex: 1;
  min-width: 0;
`

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
    <Row className={className}>
      <PickerSlot>
        <DatePickerField
          value={from}
          onChange={(v) => onChange({ from: v, to })}
          placeholder={fromPlaceholder}
          disabled={disabled}
        />
      </PickerSlot>
      <Dash>—</Dash>
      <PickerSlot>
        <DatePickerField
          value={to}
          onChange={(v) => onChange({ from, to: v })}
          placeholder={toPlaceholder}
          disabled={disabled}
        />
      </PickerSlot>
    </Row>
  )
}
