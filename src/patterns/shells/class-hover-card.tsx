import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

const CARD_WIDTH = 280
const CARD_HORIZONTAL_PADDING = 24
const CARD_VERTICAL_OFFSET = 10
const CARD_BOTTOM_GUARD = 220

const Card = styled.div<{ $top: number; $left: number }>`
  position: fixed;
  top: ${(p) => p.$top}px;
  left: ${(p) => p.$left}px;
  width: min(${CARD_WIDTH}px, calc(100vw - ${CARD_HORIZONTAL_PADDING}px));
  padding: var(--ig-space-4);
  border-radius: var(--ig-radius-lg);
  border: 1px solid var(--ig-color-white-08);
  background: var(--ig-color-surface-raised);
  box-shadow: var(--ig-shadow-floating);
  z-index: var(--ig-z-tooltip);
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
`

const Title = styled.span`
  font-size: var(--ig-font-size-sm);
  font-weight: 700;
  color: var(--ig-color-text-primary);
`

const Description = styled.span`
  font-size: var(--ig-font-size-xs);
  line-height: 1.5;
  color: var(--ig-color-text-muted);
  white-space: pre-wrap;
`

const Image = styled.img`
  width: 100%;
  max-height: 180px;
  object-fit: contain;
  border-radius: var(--ig-radius-md);
  border: 1px solid var(--ig-color-white-08);
  background: var(--ig-color-white-04);
`

/**
 * Class hover card 의 표시 데이터 shape.
 * 단일 클래스 항목에 hover 시 표시되는 reference image + description 카드.
 */
export interface ClassHoverCardItem {
  name: string
  description?: string | null
  reference_image_url?: string | null
}

export interface ClassHoverCardProps {
  /** hover 대상 클래스 — null 이면 카드 비표시. */
  item: ClassHoverCardItem | null
  /** Anchor element 의 bottom + offset 기준 top px. */
  top: number
  /** Anchor element 의 left 기준 left px (viewport clamp 처리됨). */
  left: number
  /** reference_image_url 을 fully-qualified URL 로 변환. 미제공 시 path 그대로 사용. */
  resolveAssetUrl?: (path: string) => string
}

/**
 * Reference image + description 을 표시하는 fixed-position hover card.
 * 외부에서 useClassHoverCard 훅이 계산한 위치를 받아 그대로 렌더한다.
 */
export function ClassHoverCard({ item, top, left, resolveAssetUrl }: ClassHoverCardProps) {
  if (!item) return null
  const resolved = resolveAssetUrl ?? ((p) => p)
  return (
    <Card $top={top} $left={left}>
      <Title>{item.name}</Title>
      {item.reference_image_url ? (
        <Image src={resolved(item.reference_image_url)} alt={`${item.name} reference`} />
      ) : null}
      {item.description?.trim() ? (
        <Description>{item.description.trim()}</Description>
      ) : null}
    </Card>
  )
}

type TooltipPosition = { id: string; top: number; left: number } | null

interface HoverableClass {
  id: string
  description?: string | null
  reference_image_url?: string | null
}

export interface UseClassHoverCardResult<T> {
  /** 현재 hover 중인 항목 의 id + 위치. 없으면 null. */
  position: TooltipPosition
  /** items 에서 position.id 로 resolve 된 항목. position 이 null 이면 null. */
  item: T | null
  /** list item 의 onMouseEnter 에서 호출. content (description/reference_image_url) 가 비어있으면 noop. */
  show: (id: string, anchor: HTMLElement) => void
  /** list item 의 onMouseLeave 에서 호출. 다른 id 가 떠있으면 noop. */
  hide: (id: string) => void
}

/**
 * Class list 의 hover 상태 관리. 단일 카드만 표시되도록 보장하고
 * scroll 발생 시 자동 close. content (description/reference_image_url) 가 없는 항목은 표시 안 함.
 *
 * 사용 예:
 * ```tsx
 * const hover = useClassHoverCard(classes)
 * return (
 *   <>
 *     {classes.map((c) => (
 *       <li onMouseEnter={(e) => hover.show(c.id, e.currentTarget)} onMouseLeave={() => hover.hide(c.id)}>
 *         {c.name}
 *       </li>
 *     ))}
 *     <ClassHoverCard item={hover.item} top={hover.position?.top ?? 0} left={hover.position?.left ?? 0} />
 *   </>
 * )
 * ```
 */
export function useClassHoverCard<T extends HoverableClass>(items: T[]): UseClassHoverCardResult<T> {
  const [position, setPosition] = useState<TooltipPosition>(null)

  useEffect(() => {
    if (!position) return
    const clear = () => setPosition(null)
    window.addEventListener('scroll', clear, true)
    return () => window.removeEventListener('scroll', clear, true)
  }, [position])

  const item = useMemo(
    () => items.find((it) => it.id === position?.id) ?? null,
    [items, position],
  )

  const show = useCallback(
    (id: string, anchor: HTMLElement) => {
      const target = items.find((it) => it.id === id)
      const hasContent = !!(target?.description?.trim() || target?.reference_image_url)
      if (!hasContent) return
      const rect = anchor.getBoundingClientRect()
      const width = Math.min(CARD_WIDTH, window.innerWidth - CARD_HORIZONTAL_PADDING)
      const left = Math.min(
        Math.max(12, rect.left),
        window.innerWidth - width - 12,
      )
      const top = Math.min(rect.bottom + CARD_VERTICAL_OFFSET, window.innerHeight - CARD_BOTTOM_GUARD)
      setPosition({ id, top, left })
    },
    [items],
  )

  const hide = useCallback((id: string) => {
    setPosition((prev) => (prev?.id === id ? null : prev))
  }, [])

  return { position, item, show, hide }
}
