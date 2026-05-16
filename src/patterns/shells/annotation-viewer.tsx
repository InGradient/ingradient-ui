import React from 'react'
import styled from 'styled-components'

const Stage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: var(--ig-color-surface-muted);
  border-radius: var(--ig-radius-md);
  overflow: hidden;
`

const Thumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`

const BoxOverlay = styled.div<{ $x: number; $y: number; $w: number; $h: number; $color: string }>`
  position: absolute;
  left: ${(p) => p.$x * 100}%;
  top: ${(p) => p.$y * 100}%;
  width: ${(p) => p.$w * 100}%;
  height: ${(p) => p.$h * 100}%;
  border: 2px solid ${(p) => p.$color};
  border-radius: 2px;
  pointer-events: none;
`

const BoxLabel = styled.span<{ $color: string }>`
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(-100%);
  padding: 1px 6px;
  background: ${(p) => p.$color};
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  white-space: nowrap;
  border-radius: 2px 2px 0 0;
`

const PolygonSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`

export interface AnnotationBoundingBox {
  id: string
  label?: string
  color: string
  /** Normalized 0~1 coordinates (left / top / width / height) */
  x: number
  y: number
  width: number
  height: number
}

export interface AnnotationPolygon {
  id: string
  label?: string
  color: string
  /** Normalized 0~1 points (relative to image) */
  points: { x: number; y: number }[]
  fillOpacity?: number
}

export interface AnnotationViewerProps {
  imageUrl: string
  imageAlt?: string
  boxes?: AnnotationBoundingBox[]
  polygons?: AnnotationPolygon[]
  className?: string
}

export function AnnotationViewer({
  imageUrl, imageAlt, boxes = [], polygons = [], className,
}: AnnotationViewerProps) {
  return (
    <Stage className={className}>
      <Thumb src={imageUrl} alt={imageAlt ?? ''} />
      {polygons.length > 0 ? (
        <PolygonSvg viewBox="0 0 100 100" preserveAspectRatio="none">
          {polygons.map((p) => (
            <polygon
              key={p.id}
              points={p.points.map((pt) => `${pt.x * 100},${pt.y * 100}`).join(' ')}
              fill={p.color}
              fillOpacity={p.fillOpacity ?? 0.25}
              stroke={p.color}
              strokeWidth={0.5}
            />
          ))}
        </PolygonSvg>
      ) : null}
      {boxes.map((b) => (
        <BoxOverlay key={b.id} $x={b.x} $y={b.y} $w={b.width} $h={b.height} $color={b.color}>
          {b.label ? <BoxLabel $color={b.color}>{b.label}</BoxLabel> : null}
        </BoxOverlay>
      ))}
    </Stage>
  )
}
