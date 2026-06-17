import type { ReactNode } from 'react'

export interface EdgeAppShellViewProps {
  isResolving: boolean
  isShuttingDown: boolean
  showFooter: boolean

  titleBar: ReactNode
  content: ReactNode
  bottomBar?: ReactNode
  systemMonitorModal?: ReactNode
}

export interface MainLayoutViewProps {
  topBar: ReactNode
  leftPanel: ReactNode
  centerContent: ReactNode
  rightPanel: ReactNode
  isCapturing: boolean
}
