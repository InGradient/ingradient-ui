import React from 'react'
import {
  DropdownOptionButton,
  DropdownOptionDescription,
  DropdownOptionLabel,
  DropdownTrigger,
  DropdownValue,
  renderChevron,
  type DropdownOption,
} from './dropdown-shared'
import { PopoverTriggerField } from './popover-trigger-field'

export type { DropdownOption } from './dropdown-shared'

export function DropdownSelect({
  value,
  options,
  onChange,
  disabled = false,
}: {
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  disabled?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const selectedOption = options.find((option) => option.value === value) ?? options[0]

  return (
    <PopoverTriggerField
      open={open}
      onOpenChange={setOpen}
      menuRole="listbox"
      trigger={
        <DropdownTrigger
          type="button"
          $open={open}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <DropdownValue>{selectedOption?.label ?? ''}</DropdownValue>
          {renderChevron(open)}
        </DropdownTrigger>
      }
    >
      {options.map((option) => (
        <DropdownOptionButton
          key={option.value}
          type="button"
          $active={option.value === value}
          onClick={() => {
            onChange(option.value)
            setOpen(false)
          }}
        >
          <DropdownOptionLabel>{option.label}</DropdownOptionLabel>
          {option.description ? <DropdownOptionDescription>{option.description}</DropdownOptionDescription> : null}
        </DropdownOptionButton>
      ))}
    </PopoverTriggerField>
  )
}
