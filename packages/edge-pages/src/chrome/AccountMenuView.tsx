import { useRef } from 'react'
import ReactDOM from 'react-dom'
import { DialogShell, iconSizeNumbers } from '@ingradient/ui'
import { Button, ContextMenuWithSubmenus, EmptyState, UserCircleIcon } from '@ingradient/ui/components'
import {
  AccountBtn, AccountBtnName, AccountMenuWrap,
  HistoryList, HistoryEntry, HistoryName, HistoryEmail,
} from './AccountMenuView.styles'
import type { AccountMenuViewProps } from './types'

export function AccountMenuView(props: AccountMenuViewProps): JSX.Element | null {
  const {
    currentUser, accountHistory, dropdownOpen, changeAccountModalOpen, labels,
    onToggleDropdown, onCloseDropdown, onOpenChangeAccount, onCloseChangeAccount,
    onLogout, onSelectAccount,
  } = props
  const accountBtnRef = useRef<HTMLButtonElement>(null)

  if (!currentUser) return null

  return (
    <>
      <AccountMenuWrap>
        <AccountBtn
          ref={accountBtnRef}
          title={labels.account}
          onClick={(e) => { e.stopPropagation(); onToggleDropdown() }}
        >
          <UserCircleIcon size={iconSizeNumbers.lg} />
          <AccountBtnName>{currentUser.name || currentUser.email}</AccountBtnName>
        </AccountBtn>
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
          onClose={onCloseChangeAccount}
          width="min(var(--ig-popup-xl), 100%)"
          actions={<Button variant="secondary" onClick={onCloseChangeAccount}>{labels.cancel}</Button>}
        >
          {accountHistory.length === 0 ? (
            <EmptyState>{labels.noAccountHistory}</EmptyState>
          ) : (
            <HistoryList>
              {accountHistory.map((entry) => (
                <HistoryEntry key={entry.email} onClick={() => onSelectAccount(entry)}>
                  <HistoryName>{entry.name}</HistoryName>
                  <HistoryEmail>{entry.email}</HistoryEmail>
                </HistoryEntry>
              ))}
            </HistoryList>
          )}
        </DialogShell>,
        document.body,
      )}
    </>
  )
}
