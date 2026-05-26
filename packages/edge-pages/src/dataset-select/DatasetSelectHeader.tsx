import type { ReactNode } from 'react'
import { RefreshCw, Settings } from 'lucide-react'
import {
  Header, HeaderLeft, Title, HeaderRight, ModeTag,
  RefreshBtn, IconBtn, StatusItem, StatusDot,
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
          <ModeTag $online={mode === 'online'}>
            {mode === 'online' ? onlineLabel : offlineLabel}
          </ModeTag>
        </Title>
      </HeaderLeft>
      <HeaderRight>
        <StatusItem title={connectionTitle}>
          <StatusDot
            type="button"
            $status={connectionStatus}
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
          <RefreshCw size={18} />
        </RefreshBtn>

        <IconBtn
          title={canSetupCamera ? settingsTitle : settingsDisabledTitle}
          onClick={() => canSetupCamera && onOpenSettings()}
          disabled={!canSetupCamera}
        >
          <Settings size={18} />
        </IconBtn>

        {accountMenu}
      </HeaderRight>
    </Header>
  )
}
