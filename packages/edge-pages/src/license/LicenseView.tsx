import { iconSizeNumbers } from '@ingradient/ui'
import { Button, Card, IconButton, TextField, SettingsIcon } from '@ingradient/ui/components'
import { Stack, H1, Text } from '@ingradient/ui/primitives'
import {
  Wrap, LangCorner,
  FingerprintBox, FingerprintText, HintBox,
} from './LicenseView.styles'
import type { LicenseViewProps } from './types'
import { SurfaceDepthProvider } from '@ingradient/ui/primitives'

const KEY_PLACEHOLDER = 'XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX'

function LicenseViewContent(props: LicenseViewProps): JSX.Element {
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
        padding="var(--ig-spacing-32)"
        style={{ width: '100%', maxWidth: 'var(--ig-popup-lg-plus)' }}
      >
        <Stack gap="var(--ig-spacing-20)">
        <H1>{labels.title}</H1>
        <Text size="var(--ig-text-body-sm)" tone="muted" align="center">
          {isBind ? labels.bindHint : labels.subtitle}
        </Text>

        <Stack gap="var(--ig-spacing-8)">
          <Text as="label" size="var(--ig-text-caption)" weight="semibold" tone="muted" uppercase letterSpacing="wide">
            {labels.fingerprintLabel}
          </Text>
          <FingerprintBox>
            <FingerprintText>{fingerprint}</FingerprintText>
            <Button type="button" variant="secondary" size="sm" onClick={onCopyFingerprint} title={labels.copy}>
              {copied ? labels.copied : labels.copy}
            </Button>
          </FingerprintBox>
        </Stack>

        {isBind ? (
          <>
            <HintBox>{labels.bindHint}</HintBox>
            <Button variant="solid" type="button" onClick={onBind} disabled={submitting}>
              {submitting ? labels.binding : labels.bindButton}
            </Button>
          </>
        ) : (
          <>
            <HintBox>{labels.hint}</HintBox>
            <Stack as="form" gap="var(--ig-spacing-12)" onSubmit={onSubmit}>
              <Stack gap="var(--ig-spacing-8)">
                <Text as="label" htmlFor="license-key" size="var(--ig-text-caption)" weight="semibold" tone="muted" uppercase letterSpacing="wide">
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
              <Button variant="solid" type="submit" disabled={submitting || !licenseKey.trim()}>
                {submitting ? labels.activating : labels.activate}
              </Button>
            </Stack>
          </>
        )}

        {error && (
          <Text size="var(--ig-text-body-sm)" tone="danger" align="center">
            {error}
          </Text>
        )}
        </Stack>
      </Card>
    </Wrap>
  )
}

/**
 * Edge uses the same surface rules as Platform: a rounded surface inside another rounded
 * surface is always less rounded than its parent (DESIGN.draft.md §5).
 */
export function LicenseView(props: LicenseViewProps) {
  return (
    <SurfaceDepthProvider>
      <LicenseViewContent {...props} />
    </SurfaceDepthProvider>
  )
}
