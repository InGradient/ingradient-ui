import { controlSizeNumbers } from '@ingradient/ui'
import { Spinner } from '@ingradient/ui/components'
import {
  AppRoot, AppHeader, AppContent, AppFooterBar, ShutdownOverlay,
} from './EdgeAppShellView.styles'
import type { EdgeAppShellViewProps } from './types'
import { SurfaceDepthProvider } from '@ingradient/ui/primitives'

function EdgeAppShellViewContent(props: EdgeAppShellViewProps): JSX.Element {
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
        {titleBar && <AppHeader>{titleBar}</AppHeader>}
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

/**
 * Edge uses the same surface rules as Platform: a rounded surface inside another rounded
 * surface is always less rounded than its parent (DESIGN.draft.md §5).
 */
export function EdgeAppShellView(props: EdgeAppShellViewProps) {
  return (
    <SurfaceDepthProvider>
      <EdgeAppShellViewContent {...props} />
    </SurfaceDepthProvider>
  )
}
