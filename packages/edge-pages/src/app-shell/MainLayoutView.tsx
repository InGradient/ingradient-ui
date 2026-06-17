import {
  AppShell, AppHeader, PanelsRow, LeftPanel, CenterPanel, RightPanelContainer,
  CapturingBlocker,
} from './MainLayoutView.styles'
import type { MainLayoutViewProps } from './types'

export function MainLayoutView(props: MainLayoutViewProps): JSX.Element {
  const { topBar, leftPanel, centerContent, rightPanel, isCapturing } = props
  return (
    <AppShell>
      <AppHeader>{topBar}</AppHeader>
      <PanelsRow>
        <LeftPanel>{leftPanel}</LeftPanel>
        <CenterPanel>{centerContent}</CenterPanel>
        <RightPanelContainer>{rightPanel}</RightPanelContainer>
      </PanelsRow>
      {isCapturing && <CapturingBlocker aria-hidden />}
    </AppShell>
  )
}
