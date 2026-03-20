import React from 'react'
import {
  DropdownMenu,
  DropdownOptionButton,
  DropdownOptionDescription,
  DropdownOptionLabel,
  DropdownRoot,
  DropdownTrigger,
  DropdownValue,
  renderChevron,
  type DropdownOption,
} from './dropdown-shared'
import { useDropdownLayout } from './dropdown-layout'

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
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const menuLayout = useDropdownLayout(rootRef, open, () => setOpen(false))

  const selectedOption = options.find((option) => option.value === value) ?? options[0]

  return (
    <DropdownRoot ref={rootRef}>
      <DropdownTrigger type="button" $open={open} disabled={disabled} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((prev) => !prev)}>
        <DropdownValue>{selectedOption?.label ?? ''}</DropdownValue>
        {renderChevron(open)}
      </DropdownTrigger>
      {open && menuLayout && (
        <DropdownMenu role="listbox" $layout={menuLayout}>
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
        </DropdownMenu>
      )}
    </DropdownRoot>
  )
}
