import { iconSizeNumbers } from '@ingradient/ui'
import { IconButton, StatusDot } from '@ingradient/ui/components'
import { RefreshCw, Settings, ChevronLeft } from 'lucide-react'
import {
  ConnectingSpinner, Container, LeftSection, RightSection, StatusItem,
  EdgeInfoSection, BreadcrumbWrap, BreadcrumbProject, BreadcrumbSep,
  BreadcrumbDataset,
} from './TopBarView.styles'
import type { TopBarViewProps } from './types'

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
        <LeftSection>
          {selectedDatasetName && (
            <EdgeInfoSection>
              <IconButton variant="secondary" size="sm" onClick={onBackToDatasets}>
                <ChevronLeft size={iconSizeNumbers.sm} />
              </IconButton>
              <BreadcrumbWrap>
                {selectedProjectName && <BreadcrumbProject>{selectedProjectName}</BreadcrumbProject>}
                {selectedProjectName && <BreadcrumbSep>/</BreadcrumbSep>}
                <BreadcrumbDataset>{selectedDatasetName}</BreadcrumbDataset>
              </BreadcrumbWrap>
            </EdgeInfoSection>
          )}
        </LeftSection>
        <RightSection>
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
            {isRefreshing ? <ConnectingSpinner size="md" /> : <RefreshCw size={iconSizeNumbers.lg} />}
          </IconButton>
          <IconButton
            variant="secondary"
            size="sm"
            title={canSetupCamera ? labels.settingsTitle : labels.settingsDisabledTitle}
            onClick={() => canSetupCamera && onOpenSettings()}
            disabled={!canSetupCamera}
          >
            <Settings size={iconSizeNumbers.lg} />
          </IconButton>
          {accountMenu}
        </RightSection>
      </Container>
      {settingsDialog}
    </>
  )
}
