import { IconButton, Stack, iconSizeNumbers } from '@ingradient/ui'
import {
  AlertCircleIcon, CheckCircleIcon, InfoIcon, PanelLeftOpenIcon,
} from '@ingradient/ui/components'
import type { LogPanelEntry } from './types'

/**
 * 접힌 Logs 패널 — 펼치기 버튼과 로그 상태 점만 보여준다.
 *
 * 점에 마우스를 올리면 펼친 상태와 **같은 동작**이 일어난다(hover index 가 같다) — 좁혀
 * 놓고도 오른쪽 상세 패널로 내용을 읽을 수 있다. 시간·본문·필터는 펼쳐야 보인다.
 * 펼치기 버튼이 항상 맨 위에 있어 갇히는 상태가 없다.
 *
 * 펼친 상태는 `LogPanelView` 다. 우측 패널의 `RightPanelCollapsedView` 와 같은 짝이다.
 */
export interface LogPanelCollapsedViewProps {
  entries: { log: LogPanelEntry; index: number }[]
  hoveredLogIndex: number | null
  labels: { expandPanel: string }
  onSetHoveredLogIndex: (i: number | null) => void
  onExpand: () => void
}

function typeIcon(type: LogPanelEntry['type']): JSX.Element {
  if (type === 'error') return <AlertCircleIcon size={iconSizeNumbers.sm} color="var(--ig-color-danger)" />
  if (type === 'success') return <CheckCircleIcon size={iconSizeNumbers.sm} color="var(--ig-color-success)" />
  return <InfoIcon size={iconSizeNumbers.sm} color="var(--ig-color-accent-soft)" />
}

export function LogPanelCollapsedView(props: LogPanelCollapsedViewProps): JSX.Element {
  const { entries, hoveredLogIndex, labels, onSetHoveredLogIndex, onExpand } = props

  return (
    <Stack gap="var(--ig-space-2)" align="center" style={{ padding: 'var(--ig-space-2)' }}>
      <IconButton
        size="xs"
        variant="ghost"
        title={labels.expandPanel}
        aria-label={labels.expandPanel}
        onClick={onExpand}
      >
        <PanelLeftOpenIcon size={iconSizeNumbers.sm} />
      </IconButton>

      {entries.map(({ log, index }) => (
        <IconButton
          key={index}
          size="xs"
          variant="ghost"
          title={log.msg}
          aria-label={log.msg}
          aria-pressed={hoveredLogIndex === index}
          onMouseEnter={() => onSetHoveredLogIndex(index)}
          onMouseLeave={() => onSetHoveredLogIndex(null)}
        >
          {typeIcon(log.type)}
        </IconButton>
      ))}
    </Stack>
  )
}
