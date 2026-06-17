import { useRef } from 'react'
import ReactDOM from 'react-dom'
import { DialogShell, useClickOutside, iconSizeNumbers } from '@ingradient/ui'
import { UserCircle } from 'lucide-react'
import {
  AccountBtn, AccountBtnName, AccountMenuWrap, AccountDropdown,
  AccountMenuEmail, AccountMenuItem, AccountMenuDanger,
  HistoryList, HistoryEntry, HistoryName, HistoryEmail,
  ModalEmptyText, ModalCancelBtn,
} from './AccountMenuView.styles'
import type { AccountMenuViewProps } from './types'

export function AccountMenuView(props: AccountMenuViewProps): JSX.Element | null {
  const {
    currentUser, accountHistory, dropdownOpen, changeAccountModalOpen, labels,
    onToggleDropdown, onCloseDropdown, onOpenChangeAccount, onCloseChangeAccount,
    onLogout, onSelectAccount,
  } = props
  const accountMenuRef = useRef<HTMLDivElement>(null)

  useClickOutside({
    refs: accountMenuRef,
    onClickOutside: onCloseDropdown,
    enabled: dropdownOpen,
  })

  if (!currentUser) return null

  return (
    <>
      <AccountMenuWrap ref={accountMenuRef}>
        <AccountBtn
          title={labels.account}
          onClick={(e) => { e.stopPropagation(); onToggleDropdown() }}
        >
          <UserCircle size={iconSizeNumbers.lg} />
          <AccountBtnName>{currentUser.name || currentUser.email}</AccountBtnName>
        </AccountBtn>
        {dropdownOpen && (
          <AccountDropdown>
            <AccountMenuEmail>{currentUser.email}</AccountMenuEmail>
            <AccountMenuItem onClick={onOpenChangeAccount}>
              {labels.changeAccount}
            </AccountMenuItem>
            <AccountMenuDanger onClick={onLogout}>
              {labels.logout}
            </AccountMenuDanger>
          </AccountDropdown>
        )}
      </AccountMenuWrap>

      {changeAccountModalOpen && ReactDOM.createPortal(
        <DialogShell
          title={labels.accountHistory}
          onClose={onCloseChangeAccount}
          width="min(var(--ig-popup-xl), 100%)"
          actions={<ModalCancelBtn onClick={onCloseChangeAccount}>{labels.cancel}</ModalCancelBtn>}
        >
          {accountHistory.length === 0 ? (
            <ModalEmptyText>{labels.noAccountHistory}</ModalEmptyText>
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
