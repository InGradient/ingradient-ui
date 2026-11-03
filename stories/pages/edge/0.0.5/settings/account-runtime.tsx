import { useState } from 'react'
import { Button } from '@ingradient/ui'
import { AccountMenuView, LangSelectorView, type AccountUser } from '@ingradient/edge-pages'
import { ACCOUNT_MENU_LABELS, SAMPLE_USER } from '../../../../fixtures/edge/0.0.5'
import type { MockAction } from './tabs-moved'

/** The product's three UI languages (ingradient-edge LangSelector). */
export const EDGE_LANG_OPTIONS = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
  { value: 'vi', label: 'Tiếng Việt' },
]

export function LanguageRuntime({ value, onChange, onMockAction }: { value?: string; onChange?: (value: string) => void; onMockAction?: MockAction } = {}) {
  const [local, setLocal] = useState('en')
  const [open, setOpen] = useState(false)
  return <LangSelectorView value={value ?? local} options={EDGE_LANG_OPTIONS} open={open} label="Language"
    onToggle={() => setOpen((o) => !o)} onClose={() => setOpen(false)}
    onSelect={(next) => { setLocal(next); onChange?.(next); onMockAction?.('language-change', next) }} />
}

export function AccountRuntime({ currentUser, onUserChange, onMockAction }: { currentUser?: AccountUser | null; onUserChange?: (user: AccountUser | null) => void; onMockAction?: MockAction } = {}) {
  const [localUser, setLocalUser] = useState<AccountUser | null>(SAMPLE_USER)
  const user = currentUser === undefined ? localUser : currentUser
  const [open, setOpen] = useState(false)
  const [change, setChange] = useState(false)
  const [result, setResult] = useState('')
  const select = (next: AccountUser | null) => {
    setLocalUser(next); onUserChange?.(next); setOpen(false); setChange(false)
    setResult(next ? `Mock account selected: ${next.email}. No authentication performed.` : 'Mock signed out; no authentication request.')
    onMockAction?.(next ? 'account-change' : 'account-logout', next)
  }
  return <div><AccountMenuView currentUser={user} accountHistory={[SAMPLE_USER, { name: 'Mock Operator', email: 'operator@example.test' }]}
    dropdownOpen={open} changeAccountModalOpen={change} labels={ACCOUNT_MENU_LABELS}
    onToggleDropdown={() => setOpen((value) => !value)} onCloseDropdown={() => setOpen(false)}
    onOpenChangeAccount={() => { setOpen(false); setChange(true) }} onCloseChangeAccount={() => setChange(false)}
    onLogout={() => select(null)} onSelectAccount={select} />
    {!user && <Button variant="secondary" onClick={() => select(SAMPLE_USER)}>Restore mock account</Button>}
    {result && <span role="status">{result}</span>}</div>
}
