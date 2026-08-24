import { iconSizeNumbers } from '@ingradient/ui'
import { Button, Card, IconButton, TextField, SettingsIcon } from '@ingradient/ui/components'
import { Stack, H1, Text } from '@ingradient/ui/primitives'
import {
  Wrap, LangCorner,
  FingerprintBox, FingerprintText, CopyBtn, HintBox,
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
        <H1>{labels.title}</H1>
        <Text size="var(--ig-font-size-sm)" tone="muted" align="center" style={{ lineHeight: 'var(--ig-line-height-loose)' }}>
          {isBind ? labels.bindHint : labels.subtitle}
        </Text>

        <Stack gap="var(--ig-space-2)">
          <Text as="label" size="var(--ig-font-size-xs)" weight="semibold" tone="muted" uppercase letterSpacing="wide">
            {labels.fingerprintLabel}
          </Text>
          <FingerprintBox>
            <FingerprintText>{fingerprint}</FingerprintText>
            <CopyBtn type="button" onClick={onCopyFingerprint} title={labels.copy}>
              {copied ? labels.copied : labels.copy}
            </CopyBtn>
          </FingerprintBox>
        </Stack>

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
            <Stack as="form" gap="var(--ig-space-5)" onSubmit={onSubmit}>
              <Stack gap="var(--ig-space-2)">
                <Text as="label" htmlFor="license-key" size="var(--ig-font-size-xs)" weight="semibold" tone="muted" uppercase letterSpacing="wide">
                  {labels.keyLabel}
                </Text>
                <TextField
                  id="license-key" type="text"
                  placeholder={KEY_PLACEHOLDER}
                  value={licenseKey}
                  onChange={(e) => onLicenseKeyChange(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  disabled={submitting}
                />
              </Stack>
              <Button variant="accent" type="submit" disabled={submitting || !licenseKey.trim()}>
                {submitting ? labels.activating : labels.activate}
              </Button>
            </Stack>
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