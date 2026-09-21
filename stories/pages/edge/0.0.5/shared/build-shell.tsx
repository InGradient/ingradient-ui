// Shared Edge frame. Synthetic runtime wrappers preserve existing slot callers.
import type { ReactNode } from 'react'
import { EdgeAppShellView } from '@ingradient/edge-pages'
import { AccountRuntime, LanguageRuntime } from '../settings/account-runtime'
import { SystemMonitorRuntime } from '../settings/system-runtime'
import { TitleBarRuntime, TopBarRuntime, type TopBarOptions } from '../settings/chrome-runtime'
import type { MockAction } from '../settings/tabs-moved'

export const LangSlot = <LanguageRuntime />
export const AccountSlot = <AccountRuntime />
export const TitleBarSlot = <TitleBarRuntime />
export const BottomBarSlot = SystemMonitorRuntime

export function buildTopBar(opts: TopBarOptions): ReactNode {
  return <TopBarRuntime {...opts} />
}

export function EdgeAppFrame(props: {
  content: ReactNode
  showFooter: boolean
  isConnected?: boolean
  isCapturing?: boolean
  onMockAction?: MockAction
}): JSX.Element {
  return (
    <EdgeAppShellView
      isResolving={false}
      isShuttingDown={false}
      showFooter={props.showFooter}
      titleBar={<div style={{ display: 'contents' }} ref={(node) => node?.toggleAttribute('inert', props.isCapturing ?? false)}>{TitleBarSlot}</div>}
      content={props.content}
      bottomBar={props.showFooter ? <div style={{ display: 'contents' }} ref={(node) => node?.toggleAttribute('inert', props.isCapturing ?? false)}><BottomBarSlot isConnected={props.isConnected} onMockAction={props.onMockAction} /></div> : undefined}
    />
  )
}
