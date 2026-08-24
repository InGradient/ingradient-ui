import { iconSizeNumbers } from '@ingradient/ui'
import type { ReactNode } from 'react'
import { Badge, IconButton, StatusDot, RefreshIcon, SettingsIcon } from '@ingradient/ui/components'
import { Inline, Text } from '@ingradient/ui/primitives'
import {
  Header, RefreshBtn,
} from './styles/header.styles'
import type { ConnectionStatus } from './types'

interface DatasetSelectHeaderProps {
  title: string
  mode: 'online' | 'offline'
  onlineLabel: string
  offlineLabel: string
  connectionStatus: ConnectionStatus
  connectionTitle: string

  refreshLabel: string
  loading: boolean
  onRefresh: () => void

  settingsTitle: string
  settingsDisabledTitle: string
  canSetupCamera: boolean
  onOpenSettings: () => void

  langSelector?: ReactNode
  accountMenu?: ReactNode
}

export function DatasetSelectHeader(props: DatasetSelectHeaderProps): JSX.Element {
  const {
    title, mode, onlineLabel, offlineLabel,
    connectionStatus, connectionTitle,
    refreshLabel, loading, onRefresh,
    settingsTitle, settingsDisabledTitle, canSetupCamera, onOpenSettings,
    langSelector, accountMenu,
  } = props

  return (
    <Header>
      <Inline align="center" wrap="nowrap" style={{ minHeight: 0 }}>
        <Text as="h1" size="var(--ig-font-size-2xl)" weight="bold">
          {title}
          <Badge $tone={mode === 'online' ? 'success' : 'warning'}>
            {mode === 'online' ? onlineLabel : offlineLabel}
          </Badge>
        </Text>
      </Inline>
      <Inline align="center" gap="var(--ig-space-4)" wrap="nowrap">
        <Inline align="center" wrap="nowrap" style={{ marginRight: 'var(--ig-space-1)' }} title={connectionTitle}>
          <StatusDot
            type="button"
            $tone={connectionStatus === 'connected' ? 'success' : connectionStatus === 'connecting' ? 'warning' : 'danger'}
            aria-label={connectionTitle}
            title={connectionTitle}
          />
        </Inline>

        {langSelector}

        <RefreshBtn
          aria-label={refreshLabel}
          onClick={onRefresh}
          disabled={loading}
          $spinning={loading}
          title={refreshLabel}
        >
          <RefreshIcon size={iconSizeNumbers.lg} />
        </RefreshBtn>

        <IconButton
          variant="secondary"
          size="sm"
          aria-label={canSetupCamera ? settingsTitle : settingsDisabledTitle}
          title={canSetupCamera ? settingsTitle : settingsDisabledTitle}
          onClick={() => canSetupCamera && onOpenSettings()}
          disabled={!canSetupCamera}
        >
          <SettingsIcon size={iconSizeNumbers.lg} />
        </IconButton>

        {accountMenu}
      </Inline>
    </Header>
  )
}
