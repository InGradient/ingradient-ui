import { iconSizeNumbers } from '@ingradient/ui'
import { Badge, Card, Checkbox, TextField, PasswordField, Button, IconButton, SelectableListItem, TextButton, SettingsIcon } from '@ingradient/ui/components'
import { Stack, Inline, H1, Text } from '@ingradient/ui/primitives'
import {
  Wrap, LangCorner, PackageInfo, Divider,
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

      <Card
        elevation="raised"
        flat
        padding="var(--ig-space-13)"
        style={{ width: '100%', maxWidth: 'var(--ig-popup-2xl-narrow)' }}
      >
        <Stack gap="var(--ig-space-9)">
        <H1>
          {labels.title}
          <Badge $tone={mode === 'online' ? 'success' : 'warning'}>
            {mode === 'online' ? labels.online : labels.offline}
          </Badge>
        </H1>

        {mode === 'offline' && (
          <Stack gap="var(--ig-space-3)">
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
          </Stack>
        )}

        {showLoginForm && (
          <>
            {mode === 'offline' && <Divider />}

            {hasAccountList ? (
              <Stack gap="var(--ig-space-5)">
                {savedSession && (
                  <>
                    <Text size="var(--ig-font-size-lg)" weight="semibold" align="center">
                      {labels.greeting(savedSession.name || savedSession.email)}
                    </Text>
                    <Text size="var(--ig-font-size-xs)" tone="muted" align="center">
                      {savedSession.email}
                    </Text>
                    <Button variant="accent" onClick={onContinueSession}>
                      {labels.continueSession}
                    </Button>
                  </>
                )}
                {otherAccounts.length > 0 && (
                  <Stack gap="var(--ig-space-2)">
                    {otherAccounts.map((entry) => (
                      <SelectableListItem key={entry.email} type="button" onClick={() => onSelectAccount(entry)}>
                        <Stack gap="var(--ig-space-2px)">
                          <Text size="var(--ig-font-size-md)">{entry.name || entry.email}</Text>
                          <Text size="var(--ig-font-size-xs)" tone="muted">{entry.email}</Text>
                        </Stack>
                      </SelectableListItem>
                    ))}
                  </Stack>
                )}
                <TextButton tone="accent" type="button" onClick={onChangeAccount}>
                  {labels.changeAccount}
                </TextButton>
              </Stack>
            ) : (
              <Stack as="form" gap="var(--ig-space-7)" onSubmit={onSubmit}>
                <Stack gap="var(--ig-space-2)">
                  <Text as="label" htmlFor="login-email" size="var(--ig-font-size-xs)" weight="semibold" tone="muted" uppercase letterSpacing="wide">
                    {labels.emailLabel}
                  </Text>
                  <TextField
                    id="login-email" type="email"
                    placeholder={labels.emailPlaceholder}
                    value={email} onChange={(e) => onEmailChange(e.target.value)}
                    autoComplete="username"
                    disabled={loggingIn}
                  />
                </Stack>
                <Stack gap="var(--ig-space-2)">
                  <Text as="label" htmlFor="login-password" size="var(--ig-font-size-xs)" weight="semibold" tone="muted" uppercase letterSpacing="wide">
                    {labels.passwordLabel}
                  </Text>
                  <PasswordField
                    id="login-password"
                    placeholder={labels.passwordPlaceholder}
                    value={password} onChange={(e) => onPasswordChange(e.target.value)}
                    autoComplete="current-password"
                    disabled={loggingIn}
                  />
                </Stack>
                <Stack gap="var(--ig-space-3)">
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
                </Stack>
                <Button variant="accent" type="submit" disabled={loggingIn || !email || !password}>
                  {loggingIn ? labels.submitting : labels.submit}
                </Button>
                {externalUrl && (
                  <Inline justify="center" gap="var(--ig-space-7)">
                    <TextButton tone="accent" type="button" onClick={onOpenSignup}>
                      {labels.register}
                    </TextButton>
                  </Inline>
                )}
              </Stack>
            )}
          </>
        )}

        {error && (
          <Text size="var(--ig-font-size-sm)" tone="danger" align="center">
            {error}
          </Text>
        )}
        </Stack>
      </Card>
    </Wrap>
  )
}