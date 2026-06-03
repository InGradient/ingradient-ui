import { iconSizeNumbers } from '@ingradient/ui'
import { Settings } from 'lucide-react'
import { Checkbox, TextField, PasswordField } from '@ingradient/ui/components'
import {
  Wrap, LangCorner, SettingsIconBtn, Card, Title, PackageSection, PackageInfo,
  Divider, LoginForm, Field, FieldLabel, CheckOptions, Btn, ErrorMsg,
  SessionBox, SessionGreeting, SessionMeta, ModeTag, FooterRow,
  AccountList, AccountItem, AccountItemName, AccountItemEmail,
} from './LoginView.styles'
import type { LoginViewProps } from './types'

export function LoginView(props: LoginViewProps): JSX.Element {
  const {
    mode, email, password, savePassword, keepSignedIn,
    loggingIn, loadingPackage, error,
    packageInfo, savedSession, otherAccounts,
    hasAccountList, showLoginForm, externalUrl,
    labels, langSelector, settingsDialog,
    onEmailChange, onPasswordChange, onSavePasswordChange, onKeepSignedInChange,
    onSubmit, onContinueSession, onSelectAccount, onChangeAccount,
    onLoadPackage, onOpenSignup, onOpenSettings,
  } = props

  return (
    <Wrap>
      <LangCorner>
        {langSelector}
        <SettingsIconBtn type="button" onClick={onOpenSettings} title={labels.settingsTitle}>
          <Settings size={iconSizeNumbers.md} />
        </SettingsIconBtn>
      </LangCorner>

      {settingsDialog}

      <Card>
        <Title>
          {labels.title}
          <ModeTag $online={mode === 'online'}>
            {mode === 'online' ? labels.online : labels.offline}
          </ModeTag>
        </Title>

        {mode === 'offline' && (
          <PackageSection>
            <Btn $variant="secondary" onClick={onLoadPackage} disabled={loadingPackage}>
              {loadingPackage ? labels.loading : labels.loadPackage}
            </Btn>
            {packageInfo && (
              <PackageInfo>
                {packageInfo.project_name} · v{packageInfo.package_version}
                {packageInfo.platform_url && (
                  <ModeTag $online>{labels.onlineSupport}</ModeTag>
                )}
              </PackageInfo>
            )}
          </PackageSection>
        )}

        {showLoginForm && (
          <>
            {mode === 'offline' && <Divider />}

            {hasAccountList ? (
              <SessionBox>
                {savedSession && (
                  <>
                    <SessionGreeting>
                      {labels.greeting(savedSession.name || savedSession.email)}
                    </SessionGreeting>
                    <SessionMeta>{savedSession.email}</SessionMeta>
                    <Btn $variant="primary" onClick={onContinueSession}>
                      {labels.continueSession}
                    </Btn>
                  </>
                )}
                {otherAccounts.length > 0 && (
                  <AccountList>
                    {otherAccounts.map((entry) => (
                      <AccountItem key={entry.email} type="button" onClick={() => onSelectAccount(entry)}>
                        <AccountItemName>{entry.name || entry.email}</AccountItemName>
                        <AccountItemEmail>{entry.email}</AccountItemEmail>
                      </AccountItem>
                    ))}
                  </AccountList>
                )}
                <Btn $variant="ghost" type="button" onClick={onChangeAccount}>
                  {labels.changeAccount}
                </Btn>
              </SessionBox>
            ) : (
              <LoginForm onSubmit={onSubmit}>
                <Field>
                  <FieldLabel htmlFor="login-email">{labels.emailLabel}</FieldLabel>
                  <TextField
                    id="login-email" type="email"
                    placeholder={labels.emailPlaceholder}
                    value={email} onChange={(e) => onEmailChange(e.target.value)}
                    autoComplete="username"
                    disabled={loggingIn}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="login-password">{labels.passwordLabel}</FieldLabel>
                  <PasswordField
                    id="login-password"
                    placeholder={labels.passwordPlaceholder}
                    value={password} onChange={(e) => onPasswordChange(e.target.value)}
                    autoComplete="current-password"
                    disabled={loggingIn}
                  />
                </Field>
                <CheckOptions>
                  <Checkbox
                    checked={savePassword}
                    onChange={(e) => onSavePasswordChange(e.target.checked)}
                    label={labels.savePassword}
                  />
                  <Checkbox
                    checked={keepSignedIn}
                    onChange={(e) => onKeepSignedInChange(e.target.checked)}
                    label={labels.keepSignedIn}
                  />
                </CheckOptions>
                <Btn $variant="primary" type="submit" disabled={loggingIn || !email || !password}>
                  {loggingIn ? labels.submitting : labels.submit}
                </Btn>
                {externalUrl && (
                  <FooterRow>
                    <Btn $variant="ghost" type="button" onClick={onOpenSignup}>
                      {labels.register}
                    </Btn>
                  </FooterRow>
                )}
              </LoginForm>
            )}
          </>
        )}

        {error && <ErrorMsg>{error}</ErrorMsg>}
      </Card>
    </Wrap>
  )
}
