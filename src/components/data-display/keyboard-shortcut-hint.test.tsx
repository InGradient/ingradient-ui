import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KeyboardShortcutHint } from './keyboard-shortcut-hint'

describe('KeyboardShortcutHint', () => {
  it('renders single key', () => {
    render(<KeyboardShortcutHint keys={['1']} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('renders multiple keys', () => {
    render(<KeyboardShortcutHint keys={['⌘', 'C']} />)
    expect(screen.getByText('⌘')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('renders with sm size', () => {
    const { container } = render(<KeyboardShortcutHint keys={['A']} size="sm" />)
    expect(container.querySelector('kbd')).toBeInTheDocument()
  })
})
