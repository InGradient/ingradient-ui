import { iconSizeNumbers } from '@ingradient/ui'
import { Button, Card, IconButton, TextField, SettingsIcon } from '@ingradient/ui/components'
import { Stack } from '@ingradient/ui/primitives'
import {
  Wrap, LangCorner, Title, Subtitle, Field, FieldLabel,
  FingerprintBox, FingerprintText, CopyBtn, LicenseForm,
  ErrorMsg, HintBox,
} from './LicenseView.styles'
import type { LicenseViewProps } from './types'

const KEY_PLACEHOLDER = 'XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX'

export function LicenseView(props: LicenseViewProps): JSX.Element {
  const {
    mode, fingerprint, licenseKey, submitting, copied, error,
    labels, langSelector, settingsDialog,
    onLicenseKeyChange, onSubmit, onBind, onCopyFingerprint, onOpenSettings,
  } = props
  const isBind = mode === 'bind'

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
        style={{ width: '100%', maxWidth: 'var(--ig-popup-lg-plus)' }}
      >
        <Stack gap="var(--ig-space-9)">
        <Title>{labels.title}</Title>
        <Subtitle>{isBind ? labels.bindHint : labels.subtitle}</Subtitle>

        <Field>
          <FieldLabel>{labels.fingerprintLabel}</FieldLabel>
          <FingerprintBox>
            <FingerprintText>{fingerprint}</FingerprintText>
            <CopyBtn type="button" onClick={onCopyFingerprint} title={labels.copy}>
              {copied ? labels.copied : labels.copy}
            </CopyBtn>
          </FingerprintBox>
        </Field>

        {isBind ? (
          <>
            <HintBox>{labels.bindHint}</HintBox>
            <Button variant="accent" type="button" onClick={onBind} disabled={submitting}>
              {submitting ? labels.binding : labels.bindButton}
            </Button>
          </>
        ) : (
          <>
            <HintBox>{labels.hint}</HintBox>
            <LicenseForm onSubmit={onSubmit}>
              <Field>
                <FieldLabel htmlFor="license-key">{labels.keyLabel}</FieldLabel>
                <TextField
                  id="license-key" type="text"
                  placeholder={KEY_PLACEHOLDER}
                  value={licenseKey}
                  onChange={(e) => onLicenseKeyChange(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  disabled={submitting}
                />
              </Field>
              <Button variant="accent" type="submit" disabled={submitting || !licenseKey.trim()}>
                {submitting ? labels.activating : labels.activate}
              </Button>
            </LicenseForm>
          </>
        )}

        {error && <ErrorMsg>{error}</ErrorMsg>}
        </Stack>
      </Card>
    </Wrap>
  )
}
