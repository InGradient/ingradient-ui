import { forwardRef, type InputHTMLAttributes } from 'react'
import styled from 'styled-components'

const Input = styled.input.attrs({ type: 'color' })`
  width: var(--ig-control-height-mid-plus);
  height: var(--ig-control-height-mid-plus);
  padding: var(--ig-space-2px);
  border: var(--ig-border-1px) solid var(--ig-color-border-strong);
  border-radius: var(--ig-radius-xxs);
  cursor: pointer;
  background: var(--ig-color-surface-raised);
  &:disabled {
    cursor: not-allowed;
    opacity: var(--ig-opacity-subtle);
  }
  &::-webkit-color-swatch-wrapper { padding: 0; }
  &::-webkit-color-swatch { border: none; border-radius: var(--ig-radius-2xs); }
`

export type ColorInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

/**
 * Square (40x40) native `<input type="color">` with webkit chrome overrides.
 * Standard input event/value semantics — caller reads `e.target.value` (#rrggbb).
 */
export const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>(function ColorInput(props, ref) {
  return <Input ref={ref} {...props} />
})
