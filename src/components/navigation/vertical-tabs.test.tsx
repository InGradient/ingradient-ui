import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { VerticalTabs } from './vertical-tabs'

const items = [
  { value: 'general', label: 'General', id: 'general', panelId: 'general-panel' },
  { value: 'disabled', label: 'Unavailable', disabled: true },
  { value: 'about', label: 'About', id: 'about', panelId: 'about-panel' },
]

function Demo({ appearance }: { appearance?: 'default' | 'settings' }) {
  const [value, onChange] = useState('general')
  return <VerticalTabs items={items} value={value} onChange={onChange} appearance={appearance} />
}

describe('VerticalTabs appearance', () => {
  it('preserves the default highlight and makes settings an explicit opt-in', () => {
    const { rerender } = render(<Demo />)
    expect(screen.getByRole('tablist')).toHaveAttribute('data-appearance', 'default')
    expect(screen.getByRole('tablist').querySelector('[aria-hidden]')).not.toBeNull()
    rerender(<Demo appearance="settings" />)
    expect(screen.getByRole('tablist')).toHaveAttribute('data-appearance', 'settings')
    expect(screen.getByRole('tablist').querySelector('[aria-hidden]')).toBeNull()
  })
  it.each(['default', 'settings'] as const)('preserves keyboard, disabled and panel contracts for %s', async (appearance) => {
    render(<Demo appearance={appearance} />)
    const general = screen.getByRole('tab', { name: 'General' })
    const about = screen.getByRole('tab', { name: 'About' })
    general.focus()
    fireEvent.keyDown(general, { key: 'ArrowDown' })
    await waitFor(() => expect(about).toHaveFocus())
    expect(about).toHaveAttribute('aria-selected', 'true')
    expect(about).toHaveAttribute('aria-controls', 'about-panel')
    expect(general).toHaveAttribute('tabindex', '-1')
    fireEvent.keyDown(about, { key: 'Home' })
    await waitFor(() => expect(general).toHaveFocus())
    fireEvent.keyDown(general, { key: 'End' })
    await waitFor(() => expect(about).toHaveFocus())
    fireEvent.keyDown(about, { key: 'ArrowDown' })
    await waitFor(() => expect(general).toHaveFocus())
    expect(screen.getByRole('tab', { name: 'Unavailable' })).toBeDisabled()
  })
  it('does not activate a disabled settings tab', () => {
    const change = vi.fn()
    render(<VerticalTabs items={items} value="general" onChange={change} appearance="settings" />)
    fireEvent.click(screen.getByRole('tab', { name: 'Unavailable' }))
    expect(change).not.toHaveBeenCalled()
  })
})
