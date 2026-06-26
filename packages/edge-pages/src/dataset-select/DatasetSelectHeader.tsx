import { iconSizeNumbers } from '@ingradient/ui'
import type { ReactNode } from 'react'
import { Badge, StatusDot, RefreshIcon, SettingsIcon } from '@ingradient/ui/components'
import {
  Header, HeaderLeft, Title, HeaderRight,
  RefreshBtn, IconBtn, StatusItem,
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
      <HeaderLeft>
        <Title>
          {title}
          <Badge $tone={mode === 'online' ? 'success' : 'warning'}>
            {mode === 'online' ? onlineLabel : offlineLabel}
          </Badge>
        </Title>
      </HeaderLeft>
      <HeaderRight>
        <StatusItem title={connectionTitle}>
          <StatusDot
            type="button"
            $tone={connectionStatus === 'connected' ? 'success' : connectionStatus === 'connecting' ? 'warning' : 'danger'}
            aria-label={connectionTitle}
            title={connectionTitle}
          />
        </StatusItem>

        {langSelector}

        <RefreshBtn
          onClick={onRefresh}
          disabled={loading}
          $spinning={loading}
          title={refreshLabel}
        >
          <RefreshIcon size={iconSizeNumbers.lg} />
        </RefreshBtn>

        <IconBtn
          title={canSetupCamera ? settingsTitle : settingsDisabledTitle}
          onClick={() => canSetupCamera && onOpenSettings()}
          disabled={!canSetupCamera}
        >
          <SettingsIcon size={iconSizeNumbers.lg} />
        </IconBtn>

        {accountMenu}
      </HeaderRight>
    </Header>
  )
}
