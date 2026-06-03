import { iconSizeNumbers } from '@ingradient/ui'
import { RefreshCw, Settings, ChevronLeft } from 'lucide-react'
import {
  ConnectingSpinner, Container, LeftSection, RightSection, StatusItem, StatusDot,
  IconBtn, EdgeInfoSection, BackBtn, BreadcrumbWrap, BreadcrumbProject, BreadcrumbSep,
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
              <BackBtn onClick={onBackToDatasets}>
                <ChevronLeft size={iconSizeNumbers.sm} />
              </BackBtn>
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
              $status={connectionStatus}
              aria-label={connectionTitle}
              title={connectionTitle}
            />
          </StatusItem>
          {langSelector}
          <IconBtn title={labels.refresh} onClick={onRefresh}>
            {isRefreshing ? <ConnectingSpinner size="md" /> : <RefreshCw size={iconSizeNumbers.lg} />}
          </IconBtn>
          <IconBtn
            title={canSetupCamera ? labels.settingsTitle : labels.settingsDisabledTitle}
            onClick={() => canSetupCamera && onOpenSettings()}
            disabled={!canSetupCamera}
          >
            <Settings size={iconSizeNumbers.lg} />
          </IconBtn>
          {accountMenu}
        </RightSection>
      </Container>
      {settingsDialog}
    </>
  )
}
