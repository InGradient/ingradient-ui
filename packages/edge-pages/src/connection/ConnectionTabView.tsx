import {
  ScanSectionView, ConnectSectionView, AutoSetupSectionView,
  DiagnosticsSectionView, NicControlSectionView,
  ProfileStatusSectionView, AdvancedSectionView, ConnectionGuidePanelView,
} from './sections'
import type { ConnectionTabViewProps } from './types'

export function ConnectionTabView(props: ConnectionTabViewProps): JSX.Element {
  const {
    scan, connect, autoSetup, diagnostics, nicControl, profile, advanced,
    guide, labels, forceIpDialog,
  } = props

  return (
    <>
      {guide.visible && (
        <ConnectionGuidePanelView state={guide.state} labels={labels} onDismiss={guide.onDismiss} />
      )}
      <ScanSectionView {...scan} labels={labels} />
      <AutoSetupSectionView {...autoSetup} labels={labels} />
      <ConnectSectionView {...connect} labels={labels} />
      <ProfileStatusSectionView {...profile} labels={labels} />
      <DiagnosticsSectionView {...diagnostics} labels={labels} />
      <NicControlSectionView {...nicControl} labels={labels} />
      <AdvancedSectionView {...advanced} labels={labels} />
      {forceIpDialog}
    </>
  )
}
