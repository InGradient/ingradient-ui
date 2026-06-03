import { iconSizeNumbers } from '@ingradient/ui'
import { Settings } from 'lucide-react'
import {
  Wrap, LangCorner, SettingsIconBtn, Card, Title, Subtitle, Field, FieldLabel,
  FingerprintBox, FingerprintText, CopyBtn, Input, LicenseForm, SubmitBtn,
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
        <SettingsIconBtn type="button" onClick={onOpenSettings} title={labels.settingsTitle}>
          <Settings size={iconSizeNumbers.md} />
        </SettingsIconBtn>
      </LangCorner>

      {settingsDialog}

      <Card>
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
            <SubmitBtn type="button" onClick={onBind} disabled={submitting}>
              {submitting ? labels.binding : labels.bindButton}
            </SubmitBtn>
          </>
        ) : (
          <>
            <HintBox>{labels.hint}</HintBox>
            <LicenseForm onSubmit={onSubmit}>
              <Field>
                <FieldLabel htmlFor="license-key">{labels.keyLabel}</FieldLabel>
                <Input
                  id="license-key" type="text"
                  placeholder={KEY_PLACEHOLDER}
                  value={licenseKey}
                  onChange={(e) => onLicenseKeyChange(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  disabled={submitting}
                />
              </Field>
              <SubmitBtn type="submit" disabled={submitting || !licenseKey.trim()}>
                {submitting ? labels.activating : labels.activate}
              </SubmitBtn>
            </LicenseForm>
          </>
        )}

        {error && <ErrorMsg>{error}</ErrorMsg>}
      </Card>
    </Wrap>
  )
}
