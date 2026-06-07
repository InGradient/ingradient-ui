import { controlSizeNumbers } from '@ingradient/ui'
import { Spinner } from '@ingradient/ui/components'
import {
  AppRoot, AppContent, AppFooterBar, ShutdownOverlay,
} from './EdgeAppShellView.styles'
import type { EdgeAppShellViewProps } from './types'

export function EdgeAppShellView(props: EdgeAppShellViewProps): JSX.Element {
  const {
    isResolving, isShuttingDown, showFooter,
    titleBar, content, bottomBar, systemMonitorModal,
  } = props

  return (
    <>
      {systemMonitorModal}
      {isShuttingDown && (
        <ShutdownOverlay>
          <Spinner size={controlSizeNumbers.midPlus} tone="white" />
        </ShutdownOverlay>
      )}
      {isResolving && (
        <ShutdownOverlay>
          <Spinner size={controlSizeNumbers.midPlus} tone="white" />
        </ShutdownOverlay>
      )}
      <AppRoot>
        {titleBar}
        <AppContent>
          {!isResolving && content}
        </AppContent>
        {showFooter && bottomBar && (
          <AppFooterBar>
            {bottomBar}
          </AppFooterBar>
        )}
      </AppRoot>
    </>
  )
}
