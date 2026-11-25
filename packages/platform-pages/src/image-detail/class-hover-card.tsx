import { useCallback, useEffect, useMemo, useState } from 'react'
import { FloatingOverlay } from '@ingradient/ui/components'
import { Stack, Text } from '@ingradient/ui/primitives'
import { popupSizeNumbers } from '@ingradient/ui/tokens'

const CARD_WIDTH = popupSizeNumbers.sm
const VIEWPORT_MARGIN = 12
const ANCHOR_GAP = 10
/** Room kept under the card's top edge so a card with an image stays on screen. */
const CARD_BOTTOM_GUARD = 220

const CARD_STYLE = {
  width: `min(var(--ig-popup-sm), calc(100vw - ${VIEWPORT_MARGIN * 2}px))`,
  padding: 'var(--ig-spacing-12)',
  borderRadius: 'var(--ig-radius-lg)',
}
const DESCRIPTION_STYLE = { whiteSpace: 'pre-wrap' as const }
const IMAGE_STYLE = {
  width: '100%',
  maxHeight: 'var(--ig-popup-2xs)',
  objectFit: 'contain' as const,
  borderRadius: 'var(--ig-radius-md)',
}

export interface ClassHoverCardItem {
  id: string
  name: string
  description?: string | null
  reference_image_url?: string | null
}

export interface ClassHoverCardProps {
  /** Hovered class. Null, or a class with neither image nor description, shows nothing. */
  item: ClassHoverCardItem | null
  top: number
  left: number
  /** Turns `reference_image_url` into a loadable URL. Without it the value is used as is. */
  resolveAssetUrl?: (path: string) => string
}

/** Reference image and description of a class, shown beside the row or menu item being hovered. */
export function ClassHoverCard({ item, top, left, resolveAssetUrl }: ClassHoverCardProps) {
  if (!item) return null
  const description = item.description?.trim()
  if (!item.reference_image_url && !description) return null
  return (
    <FloatingOverlay variant="tooltip" top={top} left={left} style={CARD_STYLE} role="tooltip" data-ig-component="ClassHoverCard">
      <Stack gap="var(--ig-spacing-8)">
        <Text as="span" size="var(--ig-text-body-sm)" weight="semibold">{item.name}</Text>
        {item.reference_image_url ? (
          <img
            src={resolveAssetUrl ? resolveAssetUrl(item.reference_image_url) : item.reference_image_url}
            alt={`${item.name} reference`}
            style={IMAGE_STYLE}
          />
        ) : null}
        {description ? <Text as="span" size="var(--ig-font-size-xs)" tone="muted" style={DESCRIPTION_STYLE}>{description}</Text> : null}
      </Stack>
    </FloatingOverlay>
  )
}

export interface UseClassHoverCardResult<T> {
  item: T | null
  position: { top: number; left: number } | null
  /** Call from a row's mouse enter or focus. Does nothing for a class without image or description. */
  show: (classId: string, anchor: HTMLElement) => void
  /** Call from mouse leave or blur. With an id, hides only if that class is the one shown. */
  hide: (classId?: string) => void
}

/** Tracks which class is hovered and where its card goes. One card at a time; scrolling hides it. */
export function useClassHoverCard<T extends ClassHoverCardItem>(classes: T[]): UseClassHoverCardResult<T> {
  const [state, setState] = useState<{ id: string; top: number; left: number } | null>(null)

  useEffect(() => {
    if (!state) return
    const clear = () => setState(null)
    window.addEventListener('scroll', clear, true)
    return () => window.removeEventListener('scroll', clear, true)
  }, [state])

  const item = useMemo(() => classes.find((entry) => entry.id === state?.id) ?? null, [classes, state])
  const position = useMemo(() => (state ? { top: state.top, left: state.left } : null), [state])

  const show = useCallback((classId: string, anchor: HTMLElement) => {
    const target = classes.find((entry) => entry.id === classId)
    if (!target?.description?.trim() && !target?.reference_image_url) return
    const rect = anchor.getBoundingClientRect()
    const width = Math.min(CARD_WIDTH, window.innerWidth - VIEWPORT_MARGIN * 2)
    const left = Math.min(Math.max(VIEWPORT_MARGIN, rect.left), window.innerWidth - width - VIEWPORT_MARGIN)
    const top = Math.min(rect.bottom + ANCHOR_GAP, window.innerHeight - CARD_BOTTOM_GUARD)
    setState({ id: classId, top, left })
  }, [classes])

  const hide = useCallback((classId?: string) => {
    setState((prev) => (classId == null || prev?.id === classId ? null : prev))
  }, [])

  return { item, position, show, hide }
}
