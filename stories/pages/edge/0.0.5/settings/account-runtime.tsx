import { useId, useState } from 'react'
import { DropdownSelect, Button } from '@ingradient/ui'
import { AccountMenuView, type AccountUser } from '@ingradient/edge-pages'
import { ACCOUNT_MENU_LABELS, SAMPLE_USER } from '../../../../fixtures/edge/0.0.5'
import type { MockAction } from './tabs-moved'

export function LanguageRuntime({ value, onChange, onMockAction }: { value?: string; onChange?: (value: string) => void; onMockAction?: MockAction } = {}) {
  const [local, setLocal] = useState('en')
  const id = useId()
  return <div><label htmlFor={id}>Language</label><DropdownSelect id={id} aria-label="Language" value={value ?? local}
    options={[{ value: 'en', label: 'English' }, { value: 'ko', label: '한국어' }]}
    onChange={(next) => { setLocal(next); onChange?.(next); onMockAction?.('language-change', next) }} /></div>
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
    {!user && <Button onClick={() => select(SAMPLE_USER)}>Restore mock account</Button>}
    {result && <span role="status">{result}</span>}</div>
}
