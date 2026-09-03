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
  id,
  value,
  options,
  onChange,
  disabled = false,
  'aria-label': ariaLabel,
}: {
  id?: string
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  disabled?: boolean
  'aria-label'?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const baseId = React.useId()
  const selectedOption = options.find((option) => option.value === value) ?? options[0]

  const commit = (next: DropdownOption) => {
    if (next.disabled) return
    onChange(next.value)
    setOpen(false)
  }

  React.useEffect(() => {
    if (!open) { setActiveIndex(-1); return }
    const selIdx = options.findIndex((o) => o.value === value)
    setActiveIndex(selIdx >= 0 ? selIdx : options.findIndex((o) => !o.disabled))
  }, [open])

  const moveActive = (dir: 1 | -1) => {
    setActiveIndex((prev) => {
      const n = options.length
      for (let step = 1; step <= n; step++) {
        const nx = (prev + dir * step + n * step) % n
        if (!options[nx]?.disabled) return nx
      }
      return prev
    })
  }

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false) }
    else if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveActive(-1) }
    else if (e.key === 'Home') { e.preventDefault(); setActiveIndex(options.findIndex((o) => !o.disabled)) }
    else if (e.key === 'End') { e.preventDefault(); for (let i = options.length - 1; i >= 0; i--) { if (!options[i].disabled) { setActiveIndex(i); break } } }
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const opt = options[activeIndex]
      if (opt) commit(opt)
    }
  }

  return (
    <PopoverTriggerField
      open={open}
      onOpenChange={setOpen}
      menuRole="listbox"
      menuAriaLabel={ariaLabel ? `${ariaLabel} options` : 'Options'}
      trigger={
        <DropdownTrigger
          id={id}
          type="button"
          $open={open}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={ariaLabel}
          aria-activedescendant={open && activeIndex >= 0 ? `${baseId}-opt-${activeIndex}` : undefined}
          onKeyDown={handleTriggerKeyDown}
          onClick={() => setOpen((prev) => !prev)}
        >
          <DropdownValue>{selectedOption?.label ?? ''}</DropdownValue>
          {renderChevron(open)}
        </DropdownTrigger>
      }
    >
      {options.map((option, index) => (
        <DropdownOptionButton
          key={option.value}
          id={`${baseId}-opt-${index}`}
          role="option"
          aria-selected={option.value === value}
          type="button"
          disabled={option.disabled}
          $active={option.value === value}
          $highlighted={index === activeIndex}
          onClick={() => commit(option)}
        >
          <DropdownOptionLabel>{option.label}</DropdownOptionLabel>
          {option.description ? <DropdownOptionDescription>{option.description}</DropdownOptionDescription> : null}
        </DropdownOptionButton>
      ))}
    </PopoverTriggerField>
  )
}
