import React from 'react'
import {
  DropdownMenu,
  DropdownOptionButton,
  DropdownOptionLabel,
  DropdownRoot,
  DropdownTrigger,
  DropdownValue,
  HiddenSelectInput,
  getSelectOptions,
  renderChevron,
} from './dropdown-shared'
import { useDropdownLayout } from './dropdown-layout'

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
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const nativeRef = React.useRef<HTMLSelectElement | null>(null)
  const handleClose = React.useCallback(() => {
    setOpen(false)
  }, [])
  const menuLayout = useDropdownLayout(rootRef, open, handleClose)

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

  return (
    <DropdownRoot ref={rootRef} className={className} style={style}>
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
              $active={option.value === selectedValue}
              disabled={option.disabled}
              onClick={() => !option.disabled && commitValue(option.value)}
            >
              <DropdownOptionLabel>{option.label}</DropdownOptionLabel>
            </DropdownOptionButton>
          ))}
        </DropdownMenu>
      )}
    </DropdownRoot>
  )
}
