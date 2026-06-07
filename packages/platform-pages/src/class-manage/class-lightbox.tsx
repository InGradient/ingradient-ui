import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { opacityScale } from '@ingradient/ui'
import { IconButton } from '@ingradient/ui/components'
import { ChipTabs, type ChipTabsItem } from '@ingradient/ui/components'

const OVERLAY_STYLE = { position: 'absolute' as const, inset: 0, width: '100%', height: '100%', pointerEvents: 'none' as const }
const CLOSE_BTN_STYLE = { position: 'absolute' as const, top: 12, right: 12, borderRadius: 'var(--ig-radius-pill)', background: 'var(--ig-color-lightbox-surface)' }
const BACKDROP_STYLE = {
  position: 'fixed' as const,
  inset: 0,
  background: 'var(--ig-color-lightbox-backdrop)',
  display: 'flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  zIndex: 'var(--ig-z-context-menu)',
  cursor: 'pointer' as const,
}
const PANEL_WRAP_STYLE = {
  position: 'relative' as const,
  width: 'min(92vw, var(--ig-popup-4xl))',
  maxHeight: '90vh',
  display: 'flex' as const,
  flexDirection: 'column' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  cursor: 'default' as const,
}
const IMAGE_STYLE = {
  width: '100%',
  height: '100%',
  objectFit: 'contain' as const,
  borderRadius: 'var(--ig-radius-sm)',
  boxShadow: '0 8px 32px var(--ig-color-overlay-mid)',
  cursor: 'default' as const,
  display: 'block' as const,
}

const Frame = styled.div<{ $aspect: number }>`
  position: relative;
  width: min(92vw, calc((90vh - var(--ig-space-13)) * ${(p) => p.$aspect}));
  aspect-ratio: ${(p) => p.$aspect};
  max-height: 90vh;
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

export interface ClassLightboxItem extends ChipTabsItem {
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
    <div onClick={onClose} aria-label="Close enlarged view" style={BACKDROP_STYLE}>
      <div onClick={(e) => e.stopPropagation()} style={PANEL_WRAP_STYLE}>
        <ChipTabs items={siblings} currentId={activeItem.id} onSelect={(s) => setSelectedSibling(s as ClassLightboxItem)} />
        <Frame $aspect={aspect}>
          <img
            src={imageUrl}
            alt={activeItem.name ?? 'Enlarged'}
            role="presentation"
            onLoad={(e) => onImageLoad?.(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
            style={IMAGE_STYLE}
          />
          <svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden style={OVERLAY_STYLE}>
            {bboxes.map((b, i) => {
              const color = colorFor(b.classId, classIdToColor, defaultAnnotationColor)
              return (
                <rect key={`bbox-${i}`} x={b.x} y={b.y} width={b.w} height={b.h}
                  fill={color} fillOpacity={opacityScale.svgFillMedium} stroke={color} strokeWidth={0.006} />
              )
            })}
            {points.map((p, i) => (
              <circle key={`pt-${i}`} cx={p.x} cy={p.y} r={0.012}
                fill={colorFor(p.classId, classIdToColor, defaultAnnotationColor)}
                stroke="var(--ig-color-text-primary)" strokeWidth={0.004} />
            ))}
          </svg>
          <IconButton variant="secondary" type="button" onClick={onClose} aria-label="Close enlarged view" style={CLOSE_BTN_STYLE}>×</IconButton>
        </Frame>
      </div>
    </div>
  )
}
