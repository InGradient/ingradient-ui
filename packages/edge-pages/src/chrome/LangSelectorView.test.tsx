import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LangSelectorView } from './LangSelectorView'

const OPTIONS = [{ value: 'ko', label: '한국어' }, { value: 'en', label: 'English' }, { value: 'vi', label: 'Tiếng Việt' }]

function Harness({ onSelect }: { onSelect: (v: string) => void }) {
  const [value, setValue] = useState('en')
  const [open, setOpen] = useState(false)
  return <LangSelectorView value={value} options={OPTIONS} open={open} label="Language"
    onToggle={() => setOpen((o) => !o)} onClose={() => setOpen(false)}
    onSelect={(v) => { setValue(v); onSelect(v) }} />
}

describe('LangSelectorView', () => {
  it('is an icon button named with the current language, not visible text', () => {
    render(<Harness onSelect={() => undefined} />)
    const trigger = screen.getByRole('button', { name: 'Language: English' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger.textContent).toBe('')
  })
  it('lists every language as a single-choice item and reports the selection', () => {
    const onSelect = vi.fn()
    render(<Harness onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: 'Language: English' }))
    const items = screen.getAllByRole('menuitemradio')
    expect(items.map((i) => i.textContent)).toEqual(['한국어', 'English', 'Tiếng Việt'])
    expect(screen.getByRole('menuitemradio', { name: 'English' })).toHaveAttribute('aria-checked', 'true')
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Tiếng Việt' }))
    expect(onSelect).toHaveBeenCalledWith('vi')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Language: Tiếng Việt' })).toBeInTheDocument()
  })
})
