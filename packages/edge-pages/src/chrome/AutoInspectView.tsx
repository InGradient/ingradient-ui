import { iconSizeNumbers } from '@ingradient/ui'
import { Button, PlayIcon, SquareIcon } from '@ingradient/ui/components'
import { Inline, Text } from '@ingradient/ui/primitives'

const CAPTION_STYLE = {
  maxWidth: 'var(--ig-layout-size-field-lg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
} as const

export interface AutoInspectLabels {
  start: string
  stop: string
  starting: string
}

export interface AutoInspectViewProps {
  running: boolean
  /** Start requested; the workspace starts once project settings are loaded. */
  pending?: boolean
  /** No dataset open: the operator cannot start. */
  disabled?: boolean
  /** Count while running, the reason when disabled, or an error message. */
  caption?: string
  error?: boolean
  labels: AutoInspectLabels
  onStart: () => void
  onStop: () => void
}

/** PLC-driven automatic inspection start/stop in the top bar (no settings dialog needed). */
export function AutoInspectView(props: AutoInspectViewProps): JSX.Element {
  const { running, pending, disabled, caption, error, labels, onStart, onStop } = props
  return (
    <Inline gap="var(--ig-spacing-8)" wrap="nowrap">
      {caption && (
        <Text size="var(--ig-text-caption)" tone={error ? 'danger' : 'muted'} title={caption} style={CAPTION_STYLE}>
          {caption}
        </Text>
      )}
      {running ? (
        <Button size="sm" variant="secondary" type="button" onClick={onStop}
          leadingIcon={<SquareIcon size={iconSizeNumbers.sm} />}>
          {labels.stop}
        </Button>
      ) : (
        <Button size="sm" variant="secondary" type="button" onClick={onStart} disabled={disabled || pending}
          leadingIcon={<PlayIcon size={iconSizeNumbers.sm} />}>
          {pending ? labels.starting : labels.start}
        </Button>
      )}
    </Inline>
  )
}
