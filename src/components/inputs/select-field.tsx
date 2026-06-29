import React from 'react'
import {
  DropdownOptionButton,
  DropdownOptionLabel,
  DropdownTrigger,
  DropdownValue,
  HiddenSelectInput,
  getSelectOptions,
  renderChevron,
} from './dropdown-shared'
import { PopoverTriggerField } from './popover-trigger-field'

export type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement>

export function SelectField({
  children,
  value,
  defaultValue,
  onChange,
  disabled = false,
  className,
  style,
  name,
  id,
  required,
  autoFocus,
  ...props
}: SelectFieldProps) {
  const options = React.useMemo(() => getSelectOptions(children), [children])
  const initialValue = React.useMemo(() => {
    if (value != null) return String(value)
    if (defaultValue != null) return String(defaultValue)
    return options.find((option) => !option.disabled)?.value ?? ''
  }, [defaultValue, options, value])
  const isControlled = value != null
  const [internalValue, setInternalValue] = React.useState(initialValue)
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const baseId = React.useId()
  const nativeRef = React.useRef<HTMLSelectElement | null>(null)

  React.useEffect(() => {
    if (isControlled) setInternalValue(String(value))
  }, [isControlled, value])

  const selectedValue = isControlled ? String(value) : internalValue
  const selectedOption = options.find((option) => option.value === selectedValue) ?? options[0]

  const commitValue = (nextValue: string) => {
    if (!isControlled) setInternalValue(nextValue)
    if (nativeRef.current) {
      nativeRef.current.value = nextValue
      if (onChange) nativeRef.current.dispatchEvent(new Event('change', { bubbles: true }))
    }
    setOpen(false)
  }

  // 열릴 때 keyboard-active 를 현재 선택 옵션(없으면 첫 enabled)으로.
  React.useEffect(() => {
    if (!open) { setActiveIndex(-1); return }
    const selIdx = options.findIndex((o) => o.value === selectedValue)
    setActiveIndex(selIdx >= 0 ? selIdx : options.findIndex((o) => !o.disabled))
  }, [open])

  const moveActive = (dir: 1 | -1) => {
    setActiveIndex((prev) => {
      const n = options.length
      for (let step = 1; step <= n; step++) {
        const next = (prev + dir * step + n * step) % n
        if (!options[next]?.disabled) return next
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
      if (opt && !opt.disabled) commitValue(opt.value)
    }
  }

  return (
    <PopoverTriggerField
      open={open}
      onOpenChange={setOpen}
      menuRole="listbox"
      className={className}
      style={style}
      trigger={
        <>
          <HiddenSelectInput
            ref={nativeRef}
            value={selectedValue}
            onChange={onChange ?? (() => undefined)}
            disabled={disabled}
            name={name}
            id={id}
            required={required}
            autoFocus={autoFocus}
            tabIndex={-1}
            aria-hidden="true"
            {...props}
          >
            {children}
          </HiddenSelectInput>
          <DropdownTrigger
            type="button"
            $open={open}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-activedescendant={open && activeIndex >= 0 ? `${baseId}-opt-${activeIndex}` : undefined}
            onKeyDown={handleTriggerKeyDown}
            onClick={() => setOpen((prev) => !prev)}
          >
            <DropdownValue>{selectedOption?.label ?? ''}</DropdownValue>
            {renderChevron(open)}
          </DropdownTrigger>
        </>
      }
    >
      {options.map((option, index) => (
        <DropdownOptionButton
          key={option.value}
          id={`${baseId}-opt-${index}`}
          role="option"
          aria-selected={option.value === selectedValue}
          type="button"
          $active={option.value === selectedValue}
          $highlighted={index === activeIndex}
          disabled={option.disabled}
          onClick={() => !option.disabled && commitValue(option.value)}
        >
          <DropdownOptionLabel>{option.label}</DropdownOptionLabel>
        </DropdownOptionButton>
      ))}
    </PopoverTriggerField>
  )
}
