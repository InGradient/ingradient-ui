import styled from 'styled-components'
import { Button, DialogShell } from '@ingradient/ui'
import { CodeBlock, KeyValueRow } from '@ingradient/ui/components'
import type { AboutTabViewProps } from '../types'
import { Stack, Text } from '@ingradient/ui/primitives'

const Section = styled.div`margin-bottom: var(--ig-spacing-20);`
const SectionTitle = styled.h3`
  font-size: var(--ig-text-body);
  line-height: var(--ig-text-body-leading);
  font-weight: var(--ig-font-weight-bold);
  margin: 0 0 var(--ig-spacing-8);
  color: var(--ig-color-text-primary);
`
const Hero = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-spacing-12);
  margin-bottom: var(--ig-spacing-16);
`
const HeroVersion = styled.div`font-size: var(--ig-text-caption);
  line-height: var(--ig-text-caption-leading); color: var(--ig-color-text-muted); font-family: var(--ig-font-mono);`

const FingerprintBox = styled(CodeBlock)`
  font-size: var(--ig-text-body-sm);
  line-height: var(--ig-text-body-sm-leading);
  margin-top: var(--ig-spacing-8);
`

const ErrorText = styled.div`
  font-size: var(--ig-text-body-sm);
  line-height: var(--ig-text-body-sm-leading);
  color: var(--ig-color-danger);
  margin-top: var(--ig-spacing-8);
`

export function AboutTabView(props: AboutTabViewProps): JSX.Element {
  const {
    appVersion, licenseStatus, licenseExpiresAt, fingerprint,
    deactivationCode, deactivateError, isDeactivating,
    labels, updateSection,
    onOpenDeactivateConfirm, onCloseDeactivationCode,
  } = props

  const licenseLabel =
    licenseStatus === 'valid'   ? labels.licenseValid :
    licenseStatus === 'expired' ? labels.licenseExpired :
    licenseStatus === 'missing' ? labels.licenseMissing : '—'

  return (
    <>
      <Hero>
        <Stack gap="var(--ig-space-0)">
          <Text as="div" size="var(--ig-text-title-sm)" weight="bold">{labels.hero}</Text>
          <HeroVersion>{labels.versionLabel} {appVersion}</HeroVersion>
        </Stack>
      </Hero>

      <Section>
        <SectionTitle>{labels.licenseTitle}</SectionTitle>
        <KeyValueRow label={labels.licenseStatus} value={licenseLabel} />
        {licenseExpiresAt && (
          <KeyValueRow label={labels.expiresAt} value={licenseExpiresAt} />
        )}
        {fingerprint && (
          <>
            <KeyValueRow label={labels.fingerprint} value={null} />
            <FingerprintBox>{fingerprint}</FingerprintBox>
          </>
        )}
        <div style={{ marginTop: 'var(--ig-spacing-12)' }}>
          <Button variant="secondary" size="sm" type="button" onClick={onOpenDeactivateConfirm} disabled={isDeactivating}>
            {isDeactivating ? labels.deactivating : labels.deactivateButton}
          </Button>
          {deactivateError && <ErrorText>{deactivateError}</ErrorText>}
        </div>
      </Section>

      {updateSection}

      <Section>
        <SectionTitle>{labels.releaseTitle}</SectionTitle>
        <div style={{ fontSize: 'var(--ig-text-caption)', color: 'var(--ig-color-text-muted)' }}>
          {labels.copyrightLine}
        </div>
      </Section>

      {deactivationCode && (
        <DialogShell
          title={labels.deactivationCodeTitle}
          onClose={onCloseDeactivationCode}
          width="min(var(--ig-popup-2xl-narrow), 90vw)"
        >
          <div style={{ fontSize: 'var(--ig-text-body-sm)', marginBottom: 'var(--ig-spacing-8)' }}>
            {labels.deactivationCodeHint}
          </div>
          <FingerprintBox>{deactivationCode}</FingerprintBox>
        </DialogShell>
      )}
    </>
  )
}
