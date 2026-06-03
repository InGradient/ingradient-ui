import styled from 'styled-components'
import { Button, DialogShell } from '@ingradient/ui'
import type { AboutTabViewProps } from '../types'

const Section = styled.div`margin-bottom: var(--ig-space-9);`
const SectionTitle = styled.h3`
  font-size: var(--ig-font-size-md);
  font-weight: var(--ig-font-weight-bold);
  margin: 0 0 var(--ig-space-4);
  color: var(--ig-color-text-primary);
`
const Hero = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-5);
  margin-bottom: var(--ig-space-7);
`
const TitleGroup = styled.div`display: flex; flex-direction: column; gap: var(--ig-space-2px);`
const HeroTitle = styled.div`font-size: var(--ig-font-size-xl); font-weight: var(--ig-font-weight-bold); color: var(--ig-color-text-primary);`
const HeroVersion = styled.div`font-size: var(--ig-font-size-xs); color: var(--ig-color-text-muted); font-family: monospace;`

const InfoRowWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--ig-space-3) 0;
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  &:last-child { border-bottom: none; }
`
const InfoLabel = styled.span`font-size: var(--ig-font-size-sm); color: var(--ig-color-text-muted);`
const InfoValue = styled.span`font-size: var(--ig-font-size-sm); color: var(--ig-color-text-primary); font-weight: var(--ig-font-weight-semibold);`

const FingerprintBox = styled.div`
  font-family: 'Courier New', monospace;
  font-size: var(--ig-font-size-sm);
  padding: var(--ig-space-4);
  background: var(--ig-color-surface-raised);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  margin-top: var(--ig-space-3);
  user-select: all;
`

const ErrorText = styled.div`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-danger);
  margin-top: var(--ig-space-3);
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
        <TitleGroup>
          <HeroTitle>{labels.hero}</HeroTitle>
          <HeroVersion>{labels.versionLabel} {appVersion}</HeroVersion>
        </TitleGroup>
      </Hero>

      <Section>
        <SectionTitle>{labels.licenseTitle}</SectionTitle>
        <InfoRowWrap>
          <InfoLabel>{labels.licenseStatus}</InfoLabel>
          <InfoValue>{licenseLabel}</InfoValue>
        </InfoRowWrap>
        {licenseExpiresAt && (
          <InfoRowWrap>
            <InfoLabel>{labels.expiresAt}</InfoLabel>
            <InfoValue>{licenseExpiresAt}</InfoValue>
          </InfoRowWrap>
        )}
        {fingerprint && (
          <>
            <InfoRowWrap>
              <InfoLabel>{labels.fingerprint}</InfoLabel>
            </InfoRowWrap>
            <FingerprintBox>{fingerprint}</FingerprintBox>
          </>
        )}
        <div style={{ marginTop: 'var(--ig-space-5)' }}>
          <Button variant="secondary" size="sm" type="button" onClick={onOpenDeactivateConfirm} disabled={isDeactivating}>
            {isDeactivating ? labels.deactivating : labels.deactivateButton}
          </Button>
          {deactivateError && <ErrorText>{deactivateError}</ErrorText>}
        </div>
      </Section>

      {updateSection}

      <Section>
        <SectionTitle>{labels.releaseTitle}</SectionTitle>
        <div style={{ fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)' }}>
          {labels.copyrightLine}
        </div>
      </Section>

      {deactivationCode && (
        <DialogShell
          title={labels.deactivationCodeTitle}
          onClose={onCloseDeactivationCode}
          width="min(420px, 90vw)"
        >
          <div style={{ fontSize: 'var(--ig-font-size-sm)', marginBottom: 'var(--ig-space-3)' }}>
            {labels.deactivationCodeHint}
          </div>
          <FingerprintBox>{deactivationCode}</FingerprintBox>
        </DialogShell>
      )}
    </>
  )
}
