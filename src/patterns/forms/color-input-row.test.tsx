import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ColorInputRow } from './color-input-row'

describe('ColorInputRow', () => {
  it('commits valid hex values without rendering a native color input', () => {
    const onChange = vi.fn()
    render(<ColorInputRow value="#ef4444" onChange={onChange} />)

    const input = screen.getByRole('textbox', { name: 'Color hex value' })
    expect(input).not.toHaveAttribute('type', 'color')

    fireEvent.change(input, { target: { value: '10B981' } })
    fireEvent.blur(input)

    expect(onChange).toHaveBeenCalledWith('#10b981')
  })

  it('restores the current color when the hex value is invalid', () => {
    render(<ColorInputRow value="#ef4444" />)

    const input = screen.getByRole('textbox', { name: 'Color hex value' })
    fireEvent.change(input, { target: { value: '#nope' } })
    fireEvent.blur(input)

    expect(input).toHaveValue('#ef4444')
  })

  it('opens the styled editor and changes color with its controls', () => {
    const onChange = vi.fn()
    const onRandomize = vi.fn()
    render(<ColorInputRow value="#ef4444" onChange={onChange} onRandomize={onRandomize} />)

    fireEvent.click(screen.getByRole('button', { name: 'Edit color' }))
    expect(screen.getByRole('dialog', { name: 'Color editor' })).toBeInTheDocument()

    fireEvent.change(screen.getByRole('slider', { name: 'Hue' }), { target: { value: '120' } })
    expect(onChange).toHaveBeenCalled()

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Hue value' }), {
      target: { value: '240' },
    })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Saturation value' }), {
      target: { value: '50' },
    })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Lightness value' }), {
      target: { value: '40' },
    })
    expect(onChange).toHaveBeenCalledWith('#333399')

    const plane = screen.getByRole('slider', { name: 'Saturation and lightness' })
    vi.spyOn(plane, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 200,
      bottom: 100,
      width: 200,
      height: 100,
      toJSON: () => undefined,
    })
    fireEvent.pointerDown(plane, { clientX: 150, clientY: 25, pointerId: 1 })
    expect(onChange).toHaveBeenCalledWith('#8f8fef')

    fireEvent.change(screen.getByRole('textbox', { name: 'Editor hex value' }), {
      target: { value: '10b981' },
    })
    fireEvent.blur(screen.getByRole('textbox', { name: 'Editor hex value' }))
    expect(onChange).toHaveBeenCalledWith('#10b981')

    fireEvent.click(screen.getByRole('button', { name: 'Randomize color in editor' }))
    expect(onRandomize).toHaveBeenCalledOnce()

    fireEvent.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.queryByRole('dialog', { name: 'Color editor' })).not.toBeInTheDocument()
  })
})
