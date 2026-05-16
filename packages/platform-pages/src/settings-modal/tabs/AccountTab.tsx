import {
  DeleteAccountDialog,
  PasswordChangeDialog,
  SettingsAccountTab,
} from '@ingradient/ui/patterns'
import type { AccountTabProps } from '../types'

export function AccountTab(props: AccountTabProps) {
  const emailMatches = props.deleteAccountConfirmInput.trim() === (props.user?.email ?? '')
  return (
    <>
      <SettingsAccountTab
        user={props.user}
        license={props.license}
        accountName={props.name}
        onChangeAccountName={props.onChangeName}
        accountMessage={props.accountMessage}
        onSaveName={props.onSaveName}
        onOpenPassword={props.onOpenPasswordDialog}
        onLogout={props.onLogout}
        deleteAccountConfirmInput={props.deleteAccountConfirmInput}
        onChangeDeleteAccountConfirmInput={props.onChangeDeleteAccountConfirmInput}
        deleteAccountEmailMatches={emailMatches}
        onOpenDeleteAccountPreview={props.onOpenDeleteAccountDialog}
        deleteAccountMessage={props.deleteAccountMessage}
      />
      <PasswordChangeDialog
        open={props.passwordDialogOpen}
        currentPassword={props.currentPassword}
        onChangeCurrentPassword={props.onChangeCurrentPassword}
        newPassword={props.newPassword}
        onChangeNewPassword={props.onChangeNewPassword}
        newPasswordConfirm={props.newPasswordConfirm}
        onChangeNewPasswordConfirm={props.onChangeNewPasswordConfirm}
        passwordMessage={props.passwordMessage}
        onClose={props.onClosePasswordDialog}
        onSubmit={props.onSubmitPassword}
      />
      <DeleteAccountDialog
        open={props.deleteAccountDialogOpen}
        preview={props.deleteAccountPreview}
        unresolvedCount={0}
        resolutions={props.deleteAccountResolutions}
        onChangeResolutions={props.onChangeDeleteAccountResolutions}
        password={props.deleteAccountPassword}
        onChangePassword={props.onChangeDeleteAccountPassword}
        passwordReady={props.deleteAccountPassword.length > 0}
        finalConfirmText={props.deleteAccountFinalConfirm}
        onChangeFinalConfirmText={props.onChangeDeleteAccountFinalConfirm}
        onClose={props.onCloseDeleteAccountDialog}
        onSubmit={props.onSubmitDeleteAccount}
        deleteAccountMessage={props.deleteAccountMessage}
      />
    </>
  )
}
