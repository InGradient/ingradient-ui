import { useRef } from 'react'
import ReactDOM from 'react-dom'
import { DialogShell, iconSizeNumbers, SelectableListItem, Stack } from '@ingradient/ui'
import { Button, ContextMenuWithSubmenus, EmptyState, UserCircleIcon } from '@ingradient/ui/components'
import {
  AccountBtnName, AccountMenuWrap,
  HistoryList, HistoryName, HistoryEmail,
} from './AccountMenuView.styles'
import type { AccountMenuViewProps } from './types'

export function AccountMenuView(props: AccountMenuViewProps): JSX.Element | null {
  const {
    currentUser, accountHistory, dropdownOpen, changeAccountModalOpen, labels,
    onToggleDropdown, onCloseDropdown, onOpenChangeAccount, onCloseChangeAccount,
    onLogout, onSelectAccount,
  } = props
  const accountBtnRef = useRef<HTMLButtonElement>(null)
  const closeChangeAccount = () => {
    onCloseChangeAccount()
    accountBtnRef.current?.focus()
  }

  if (!currentUser) return null

  return (
    <>
      <AccountMenuWrap>
        <Button
          ref={accountBtnRef}
          variant="secondary"
          size="sm"
          title={labels.account}
          aria-label={`${labels.account}: ${currentUser.name || currentUser.email}`}
          aria-haspopup="menu"
          aria-expanded={dropdownOpen}
          onClick={(e) => { e.stopPropagation(); onToggleDropdown() }}
        >
          <UserCircleIcon size={iconSizeNumbers.lg} />
          <AccountBtnName>{currentUser.name || currentUser.email}</AccountBtnName>
        </Button>
        {dropdownOpen && (
          <ContextMenuWithSubmenus
            anchorEl={accountBtnRef.current}
            onClose={onCloseDropdown}
            actions={[
              { key: 'email', label: currentUser.email, disabled: true },
              { key: 'sep', label: '', separator: true },
              { key: 'change', label: labels.changeAccount, onClick: onOpenChangeAccount },
              { key: 'logout', label: labels.logout, tone: 'danger', onClick: onLogout },
            ]}
          />
        )}
      </AccountMenuWrap>

      {changeAccountModalOpen && ReactDOM.createPortal(
        <DialogShell
          title={labels.accountHistory}
          onClose={closeChangeAccount}
          width="min(var(--ig-popup-xl), 100%)"
          actions={<Button variant="secondary" onClick={closeChangeAccount}>{labels.cancel}</Button>}
        >
          {accountHistory.length === 0 ? (
            <EmptyState>{labels.noAccountHistory}</EmptyState>
          ) : (
            <HistoryList>
              {accountHistory.map((entry) => (
                <SelectableListItem key={entry.email} variant="card" onClick={() => { onSelectAccount(entry); accountBtnRef.current?.focus() }}>
                  <Stack gap="var(--ig-space-2px)">
                    <HistoryName>{entry.name}</HistoryName>
                    <HistoryEmail>{entry.email}</HistoryEmail>
                  </Stack>
                </SelectableListItem>
              ))}
            </HistoryList>
          )}
        </DialogShell>,
        document.body,
      )}
    </>
  )
}
