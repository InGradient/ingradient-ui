import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { PatternTabs, type PatternTabsItem } from './pattern-tabs'

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: var(--ig-color-lightbox-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
`

const PanelWrap = styled.div`
  position: relative;
  width: min(92vw, 1200px);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: default;
`

const Frame = styled.div<{ $aspect: number }>`
  position: relative;
  width: min(92vw, calc((90vh - 32px) * ${(p) => p.$aspect}));
  aspect-ratio: ${(p) => p.$aspect};
  max-height: 90vh;
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: var(--ig-radius-sm);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  cursor: default;
  display: block;
`

const Overlay = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-lightbox-surface);
  color: var(--ig-color-text-primary);
  font-size: 18px;
  cursor: pointer;
`

export interface ClassLightboxBbox {
  classId?: string
  x: number
  y: number
  w: number
  h: number
}

export interface ClassLightboxPoint {
  classId?: string
  x: number
  y: number
}

export interface ClassLightboxItem extends PatternTabsItem {
  id: string
  name?: string | null
  bboxes?: ClassLightboxBbox[] | null
  points?: ClassLightboxPoint[] | null
  width?: number | null
  height?: number | null
}

export interface ClassLightboxProps {
  open: boolean
  item: ClassLightboxItem | null
  imageUrl: string | null
  siblings?: ClassLightboxItem[]
  selectedClassId?: string | null
  classIdToColor?: Record<string, string>
  defaultAnnotationColor?: string
  loadedSize?: { width: number; height: number } | null
  onClose: () => void
  onImageLoad?: (width: number, height: number) => void
}

const filterByClass = <T extends { classId?: string }>(items: T[] | null | undefined, classId?: string | null) =>
  !items ? [] : (!classId ? items : items.filter((it) => !it.classId || it.classId === classId))

const colorFor = (id: string | undefined, map: Record<string, string>, fallback: string) =>
  (id && map[id]) || fallback

const aspectOf = (item: ClassLightboxItem, loaded?: { width: number; height: number } | null): number => {
  const w = loaded?.width ?? item.width ?? 0
  const h = loaded?.height ?? item.height ?? 0
  if (!w || !h) return 1
  return w / h
}

export function ClassLightbox({
  open, item, imageUrl,
  siblings = [], selectedClassId,
  classIdToColor = {}, defaultAnnotationColor = 'var(--ig-color-accent)',
  loadedSize, onClose, onImageLoad,
}: ClassLightboxProps) {
  const [selectedSibling, setSelectedSibling] = useState<ClassLightboxItem | null>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open || !imageUrl || !item) return null

  const activeItem = selectedSibling && siblings.some((s) => s.id === selectedSibling.id) ? selectedSibling : item
  const bboxes = filterByClass(activeItem.bboxes, selectedClassId)
  const points = filterByClass(activeItem.points, selectedClassId)
  const aspect = aspectOf(item, loadedSize)

  return (
    <Backdrop onClick={onClose} aria-label="Close enlarged view">
      <PanelWrap onClick={(e) => e.stopPropagation()}>
        <PatternTabs items={siblings} currentId={activeItem.id} onSelect={(s) => setSelectedSibling(s as ClassLightboxItem)} />
        <Frame $aspect={aspect}>
          <Image
            src={imageUrl}
            alt={activeItem.name ?? 'Enlarged'}
            role="presentation"
            onLoad={(e) => onImageLoad?.(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
          />
          <Overlay viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden>
            {bboxes.map((b, i) => {
              const color = colorFor(b.classId, classIdToColor, defaultAnnotationColor)
              return (
                <rect key={`bbox-${i}`} x={b.x} y={b.y} width={b.w} height={b.h}
                  fill={color} fillOpacity={0.22} stroke={color} strokeWidth={0.006} />
              )
            })}
            {points.map((p, i) => (
              <circle key={`pt-${i}`} cx={p.x} cy={p.y} r={0.012}
                fill={colorFor(p.classId, classIdToColor, defaultAnnotationColor)}
                stroke="var(--ig-color-text-primary)" strokeWidth={0.004} />
            ))}
          </Overlay>
          <CloseBtn type="button" onClick={onClose} aria-label="Close enlarged view">×</CloseBtn>
        </Frame>
      </PanelWrap>
    </Backdrop>
  )
}
