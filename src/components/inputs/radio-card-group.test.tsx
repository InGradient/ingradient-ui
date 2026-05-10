import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RadioCardGroup } from './radio-card-group'

const options = [
  { value: 'classification', label: 'Classification' },
  { value: 'detection', label: 'Detection' },
  { value: 'segmentation', label: 'Segmentation', disabled: true },
]

describe('RadioCardGroup', () => {
  it('renders all options', () => {
    render(<RadioCardGroup options={options} value="classification" onChange={() => {}} />)
    expect(screen.getByText('Classification')).toBeInTheDocument()
    expect(screen.getByText('Detection')).toBeInTheDocument()
    expect(screen.getByText('Segmentation')).toBeInTheDocument()
  })

  it('exposes radiogroup role on container and radio role on each option', () => {
    render(<RadioCardGroup options={options} value="classification" onChange={() => {}} />)
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('sets aria-checked=true on the selected option only', () => {
    render(<RadioCardGroup options={options} value="detection" onChange={() => {}} />)
    const radios = screen.getAllByRole('radio')
    expect(radios[0]).toHaveAttribute('aria-checked', 'false')
    expect(radios[1]).toHaveAttribute('aria-checked', 'true')
    expect(radios[2]).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onChange with the new value when a non-active option is clicked', () => {
    const onChange = vi.fn()
    render(<RadioCardGroup options={options} value="classification" onChange={onChange} />)
    fireEvent.click(screen.getByText('Detection'))
    expect(onChange).toHaveBeenCalledWith('detection')
  })

  it('does not call onChange when a disabled option is clicked', () => {
    const onChange = vi.fn()
    render(<RadioCardGroup options={options} value="classification" onChange={onChange} />)
    fireEvent.click(screen.getByText('Segmentation'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('marks disabled options with the disabled attribute', () => {
    render(<RadioCardGroup options={options} value="classification" onChange={() => {}} />)
    const radios = screen.getAllByRole('radio')
    expect(radios[2]).toBeDisabled()
  })
})
