import styled from 'styled-components'
import { Badge, Button, Spinner, SectionTitle, iconSizeNumbers } from '@ingradient/ui'
import { EmptyState, CameraIcon, RefreshIcon, CheckCircleIcon, ChevronRightIcon, UsbIcon, WifiIcon, AlertCircleIcon, WrenchIcon } from '@ingradient/ui/components'
import {
  FlatSection,
  DiscoverBar, DiscoverHint, DeviceList, DeviceCard,
  DeviceInfo, DeviceName, DeviceMeta,
} from '../ConnectionTabView.styles'
import type { ScanSectionViewProps, GigEDevice, USBDevice, NicBadge } from '../types'

const SubTitle = styled.div`
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-normal);
  color: var(--ig-color-text-muted);
  margin-bottom: var(--ig-space-2);
`

function nicBadgeTone(badge: NicBadge): 'success' | 'accent' | 'danger' {
  return badge === 'recommended' ? 'success' : badge === 'possible' ? 'accent' : 'danger'
}

function nicBadgeLabel(badge: NicBadge, labels: ScanSectionViewProps['labels']): string {
  return badge === 'recommended' ? labels.nicBadgeRecommended
    : badge === 'possible' ? labels.nicBadgePossible
    : labels.nicBadgeUnsuitable
}

export function ScanSectionView(props: ScanSectionViewProps): JSX.Element {
  const {
    isScanning, discoveredDevices, nicCandidates, isLoadingCandidates,
    selectedCamera, selectedNic, isBlocked = false, labels,
    onScan, onSelectCamera, onSelectNic, onRequestForceIp,
  } = props
  const isLoading = isScanning || isLoadingCandidates

  return (
    <FlatSection>
      <SectionTitle>{labels.scanTitle}</SectionTitle>
      <DiscoverBar>
        <Button size="sm" onClick={onScan} disabled={isLoading || isBlocked}>
          {isLoading ? <Spinner size="sm" tone="muted" /> : <RefreshIcon size={iconSizeNumbers.sm} />}
          {isLoading ? labels.scanning : labels.scan}
        </Button>
        <DiscoverHint>{labels.scanHint}</DiscoverHint>
      </DiscoverBar>

      {!isScanning && discoveredDevices.length > 0 && (
        <>
          <SubTitle>{labels.cameras} ({discoveredDevices.length})</SubTitle>
          <DeviceList>
            {discoveredDevices.map((device) => {
              const isUSB = device.type === 'usb'
              const gige = !isUSB ? (device as GigEDevice) : null
              const key = isUSB ? `usb-${(device as USBDevice).index}` : `gige-${(device as GigEDevice).ip}`
              const isSelected = selectedCamera === device
                || (isUSB && selectedCamera?.type === 'usb' && (selectedCamera as USBDevice).index === (device as USBDevice).index)
                || (!isUSB && selectedCamera?.type === 'gige' && (selectedCamera as GigEDevice).ip === (device as GigEDevice).ip)
              return (
                <DeviceCard key={key} $selected={isSelected} onClick={() => { if (!isBlocked) onSelectCamera(device) }}>
                  {isUSB
                    ? <UsbIcon size={iconSizeNumbers.lg} style={{ flexShrink: 0 }} />
                    : <CameraIcon size={iconSizeNumbers.lg} style={{ flexShrink: 0 }} />}
                  <DeviceInfo>
                    <DeviceName>
                      {isUSB ? (device as USBDevice).name : `${gige?.manufacturer || 'Unknown'} ${gige?.model || 'Camera'}`}
                    </DeviceName>
                    <DeviceMeta>
                      {isUSB
                        ? `Index ${(device as USBDevice).index} · ${(device as USBDevice).width ?? '?'}×${(device as USBDevice).height ?? '?'}`
                        : `${gige?.ip} · ${gige?.mac}`}
                    </DeviceMeta>
                  </DeviceInfo>
                  {gige && gige.reachable === false && (
                    <Badge $tone="danger"><AlertCircleIcon size={iconSizeNumbers["2xs"]} style={{ marginRight: 3 }} />{labels.notReachable}</Badge>
                  )}
                  {gige && gige.reachable === true && (
                    <Badge $tone="success">{labels.reachable}</Badge>
                  )}
                  {gige && gige.reachable === false && !isBlocked && onRequestForceIp && (
                    <Button size="sm" variant="secondary" type="button"
                      onClick={(e) => { e.stopPropagation(); onRequestForceIp(gige) }}>
                      <WrenchIcon size={iconSizeNumbers["2xs"]} />{labels.forceIp}
                    </Button>
                  )}
                  <Badge $tone={isUSB ? 'accent' : 'neutral'}>{isUSB ? 'USB' : 'GigE'}</Badge>
                  {isSelected ? <CheckCircleIcon size={iconSizeNumbers.md} style={{ flexShrink: 0 }} />
                    : <ChevronRightIcon size={iconSizeNumbers.sm} style={{ flexShrink: 0 }} />}
                </DeviceCard>
              )
            })}
          </DeviceList>
        </>
      )}
      {!isScanning && discoveredDevices.length === 0 && <EmptyState>{labels.noDevices}</EmptyState>}

      {nicCandidates && nicCandidates.length > 0 && (
        <>
          <SubTitle style={{ marginTop: 'var(--ig-space-7)' }}>{labels.nicCandidates} ({nicCandidates.length})</SubTitle>
          <DeviceList>
            {nicCandidates.map((nic) => {
              const isSelected = selectedNic?.name === nic.name
              return (
                <DeviceCard key={nic.name} $selected={isSelected} onClick={() => { if (!isBlocked) onSelectNic(nic) }}>
                  <WifiIcon size={iconSizeNumbers.lg} style={{ flexShrink: 0 }} />
                  <DeviceInfo>
                    <DeviceName>{nic.name}</DeviceName>
                    <DeviceMeta>{nic.description} · {nic.ipv4 || '—'} · {nic.status}</DeviceMeta>
                  </DeviceInfo>
                  <Badge $tone={nicBadgeTone(nic.badge)}>{nicBadgeLabel(nic.badge, labels)}</Badge>
                  {isSelected ? <CheckCircleIcon size={iconSizeNumbers.md} style={{ flexShrink: 0 }} />
                    : <ChevronRightIcon size={iconSizeNumbers.sm} style={{ flexShrink: 0 }} />}
                </DeviceCard>
              )
            })}
          </DeviceList>
        </>
      )}
    </FlatSection>
  )
}
