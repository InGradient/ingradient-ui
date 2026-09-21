import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SelectableListItem } from './selectable-list-item'

describe('SelectableListItem', () => {
  it('keeps className and style on the action row surface', () => {
    const { container } = render(<SelectableListItem className="consumer-row" style={{ width: '80%' }} action={<button>Preview</button>}>Sound</SelectableListItem>)
    expect(container.firstElementChild).toHaveClass('consumer-row')
    expect(container.firstElementChild).toHaveStyle({ width: '80%' })
    expect(screen.getByRole('button', { name: 'Sound' })).not.toHaveClass('consumer-row')
  })
  it('renders independent sibling selection and action buttons', () => {
    const select = vi.fn()
    const preview = vi.fn()
    const { container } = render(<SelectableListItem selected onClick={select} action={<button onClick={preview}>Preview</button>}>Sound</SelectableListItem>)
    expect(container.querySelector('button button')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Preview' }))
    expect(preview).toHaveBeenCalledOnce()
    expect(select).not.toHaveBeenCalled()
    const selection = screen.getByRole('button', { name: 'Sound', pressed: true })
    fireEvent.click(selection)
    expect(select).toHaveBeenCalledOnce()
    expect(preview).toHaveBeenCalledOnce()
  })
  it('renders children as content', () => {
    render(<SelectableListItem>Train v3</SelectableListItem>)
    expect(screen.getByText('Train v3')).toBeInTheDocument()
  })

  it('defaults to button element with type=button', () => {
    render(<SelectableListItem>Item</SelectableListItem>)
    const el = screen.getByRole('button', { name: 'Item' })
    expect(el.tagName).toBe('BUTTON')
    expect(el).toHaveAttribute('type', 'button')
  })

  it('renders as li when as="li"', () => {
    const { container } = render(
      <ul>
        <SelectableListItem as="li">Row</SelectableListItem>
      </ul>,
    )
    const li = container.querySelector('li')
    expect(li).not.toBeNull()
    expect(li?.textContent).toBe('Row')
    expect(li).not.toHaveAttribute('type')
  })

  it('fires onClick when clicked', () => {
    const onClick = vi.fn()
    render(<SelectableListItem onClick={onClick}>Click me</SelectableListItem>)
    fireEvent.click(screen.getByRole('button', { name: 'Click me' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire onClick when disabled (button variant)', () => {
    const onClick = vi.fn()
    render(
      <SelectableListItem onClick={onClick} disabled>
        Disabled
      </SelectableListItem>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Disabled' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('accepts variant=flat without throwing', () => {
    render(<SelectableListItem variant="flat">Flat row</SelectableListItem>)
    expect(screen.getByRole('button', { name: 'Flat row' })).toBeInTheDocument()
  })

  it('accepts variant=card (default) without throwing', () => {
    render(<SelectableListItem variant="card">Card row</SelectableListItem>)
    expect(screen.getByRole('button', { name: 'Card row' })).toBeInTheDocument()
  })

  it('renders selected state without crashing', () => {
    render(<SelectableListItem selected>Selected</SelectableListItem>)
    expect(screen.getByRole('button', { name: 'Selected' })).toBeInTheDocument()
  })

  it('renders dragOver state without crashing', () => {
    render(<SelectableListItem dragOver>Drag target</SelectableListItem>)
    expect(screen.getByRole('button', { name: 'Drag target' })).toBeInTheDocument()
  })
})
