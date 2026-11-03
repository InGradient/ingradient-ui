import { iconSizeNumbers } from '@ingradient/ui'
import { IconButton, RefreshIcon, SettingsIcon, ChevronLeftIcon, CameraIcon, FactoryIcon } from '@ingradient/ui/components'
import { ConnectingSpinner, Container, BreadcrumbWrap, BreadcrumbSep } from './TopBarView.styles'
import { StatusIconButton, type StatusIconTone } from './StatusIconButton'
import type { PlcStatusTone, TopBarViewProps } from './types'

const PLC_TONE: Record<PlcStatusTone, StatusIconTone> = { connected: 'success', disconnected: 'danger', unconfigured: 'neutral' }
import { Inline, Text } from '@ingradient/ui/primitives'

export function TopBarView(props: TopBarViewProps): JSX.Element {
  const {
    selectedProjectName, selectedDatasetName,
    connectionStatus, connectionTitle, isRefreshing, canSetupCamera,
    labels, plcStatus, autoInspect, langSelector, accountMenu, settingsDialog,
    onBackToDatasets, onRefresh, onOpenSettings, onOpenConnectionSettings,
  } = props
  const openConnection = onOpenConnectionSettings ?? (canSetupCamera ? onOpenSettings : undefined)

  return (
    <>
      <Container>
        <Inline gap="var(--ig-spacing-16)" wrap="nowrap">
          {selectedDatasetName && (
            <Inline gap="var(--ig-spacing-12)" wrap="nowrap">
              <IconButton variant="secondary" size="sm" onClick={onBackToDatasets}
                aria-label={labels.backToDatasets} title={labels.backToDatasets}>
                <ChevronLeftIcon size={iconSizeNumbers.sm} />
              </IconButton>
              <BreadcrumbWrap>
                {selectedProjectName && <Text size="var(--ig-text-body-sm)" tone="muted">{selectedProjectName}</Text>}
                {selectedProjectName && <BreadcrumbSep>/</BreadcrumbSep>}
                <Text size="var(--ig-text-body-sm)" weight="semibold">{selectedDatasetName}</Text>
              </BreadcrumbWrap>
            </Inline>
          )}
        </Inline>
        <Inline gap="var(--ig-spacing-8)" wrap="nowrap">
          {autoInspect}
          <StatusIconButton
            icon={<CameraIcon size={iconSizeNumbers.lg} />}
            tone={connectionStatus === 'connected' ? 'success' : connectionStatus === 'connecting' ? 'warning' : 'danger'}
            label={connectionTitle}
            onClick={openConnection}
          />
          {plcStatus && (
            <StatusIconButton
              icon={<FactoryIcon size={iconSizeNumbers.lg} />}
              tone={PLC_TONE[plcStatus.tone]}
              label={plcStatus.title}
              onClick={plcStatus.onOpen}
            />
          )}
          {langSelector}
          <IconButton variant="secondary" size="sm" title={labels.refresh} aria-label={labels.refresh} onClick={onRefresh}>
            {isRefreshing ? <ConnectingSpinner size="md" /> : <RefreshIcon size={iconSizeNumbers.lg} />}
          </IconButton>
          <IconButton
            variant="secondary"
            size="sm"
            title={canSetupCamera ? labels.settingsTitle : labels.settingsDisabledTitle}
            aria-label={labels.settingsTitle}
            onClick={() => canSetupCamera && onOpenSettings()}
            disabled={!canSetupCamera}
          >
            <SettingsIcon size={iconSizeNumbers.lg} />
          </IconButton>
          {accountMenu}
        </Inline>
      </Container>
      {settingsDialog}
    </>
  )
}
