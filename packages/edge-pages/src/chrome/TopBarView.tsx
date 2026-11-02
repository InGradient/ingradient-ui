import { iconSizeNumbers } from '@ingradient/ui'
import { IconButton, StatusDot, RefreshIcon, SettingsIcon, ChevronLeftIcon } from '@ingradient/ui/components'
import { ConnectingSpinner, Container, StatusItem, BreadcrumbWrap, BreadcrumbSep } from './TopBarView.styles'
import type { TopBarViewProps } from './types'
import { Inline, Text } from '@ingradient/ui/primitives'

export function TopBarView(props: TopBarViewProps): JSX.Element {
  const {
    selectedProjectName, selectedDatasetName,
    connectionStatus, connectionTitle, isRefreshing, canSetupCamera,
    labels, langSelector, accountMenu, settingsDialog,
    onBackToDatasets, onRefresh, onOpenSettings,
  } = props

  return (
    <>
      <Container>
        <Inline gap="var(--ig-spacing-16)" wrap="nowrap">
          {selectedDatasetName && (
            <Inline gap="var(--ig-spacing-12)" wrap="nowrap">
              <IconButton variant="secondary" size="sm" onClick={onBackToDatasets}>
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
          <StatusItem title={connectionTitle}>
            <StatusDot
              type="button"
              $tone={connectionStatus === 'connected' ? 'success' : connectionStatus === 'connecting' ? 'warning' : 'danger'}
              aria-label={connectionTitle}
              title={connectionTitle}
            />
          </StatusItem>
          {langSelector}
          <IconButton variant="secondary" size="sm" title={labels.refresh} onClick={onRefresh}>
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
