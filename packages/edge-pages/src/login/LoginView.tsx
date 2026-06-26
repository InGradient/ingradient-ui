import { iconSizeNumbers } from '@ingradient/ui'
import { Badge, Checkbox, TextField, PasswordField, Button, IconButton, TextButton, SettingsIcon } from '@ingradient/ui/components'
import {
  Wrap, LangCorner, Card, Title, PackageSection, PackageInfo,
  Divider, LoginForm, Field, FieldLabel, CheckOptions, ErrorMsg,
  SessionBox, SessionGreeting, SessionMeta, FooterRow,
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
        <IconButton variant="secondary" size="sm" type="button" onClick={onOpenSettings} title={labels.settingsTitle}>
          <SettingsIcon size={iconSizeNumbers.md} />
        </IconButton>
      </LangCorner>

      {settingsDialog}

      <Card>
        <Title>
          {labels.title}
          <Badge $tone={mode === 'online' ? 'success' : 'warning'}>
            {mode === 'online' ? labels.online : labels.offline}
          </Badge>
        </Title>

        {mode === 'offline' && (
          <PackageSection>
            <Button variant="secondary" onClick={onLoadPackage} disabled={loadingPackage}>
              {loadingPackage ? labels.loading : labels.loadPackage}
            </Button>
            {packageInfo && (
              <PackageInfo>
                {packageInfo.project_name} · v{packageInfo.package_version}
                {packageInfo.platform_url && (
                  <Badge $tone="success">{labels.onlineSupport}</Badge>
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
                    <Button variant="accent" onClick={onContinueSession}>
                      {labels.continueSession}
                    </Button>
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
                <TextButton tone="accent" type="button" onClick={onChangeAccount}>
                  {labels.changeAccount}
                </TextButton>
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
                <Button variant="accent" type="submit" disabled={loggingIn || !email || !password}>
                  {loggingIn ? labels.submitting : labels.submit}
                </Button>
                {externalUrl && (
                  <FooterRow>
                    <TextButton tone="accent" type="button" onClick={onOpenSignup}>
                      {labels.register}
                    </TextButton>
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
