import React, { createContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import styled from 'styled-components'
import { useZoomPan, type UseZoomPanOptions } from '../../hooks'

const Wrap = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ZoomLayer = styled.div<{ $zoom: number; $panX: number; $panY: number }>`
  transform: translate(${(p) => p.$panX}px, ${(p) => p.$panY}px) scale(${(p) => p.$zoom});
  transform-origin: center center;
  transition: ${(p) => (p.$zoom === 1 ? 'none' : 'none')};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
`

const Img = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
`

export interface ImageViewerContextValue {
  zoom: number
  containerWidth: number
  containerHeight: number
}

export const ImageViewerContext = createContext<ImageViewerContextValue | null>(null)

export interface ImageViewerProps {
  src: string
  alt?: string
  zoomOptions?: UseZoomPanOptions
  onZoomChange?: (zoom: number) => void
  /** Overlay layer (e.g. DrawingLayer) rendered on top of the image */
  children?: React.ReactNode
  className?: string
}

export function ImageViewer({
  src, alt, zoomOptions, onZoomChange, children, className,
}: ImageViewerProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const {
    zoom, pan, reset,
    handleWheel, startPan, movePan, endPan, isZoomPanning,
  } = useZoomPan(zoomOptions)

  // Non-passive wheel listener
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // Notify parent of zoom changes
  useEffect(() => { onZoomChange?.(zoom) }, [zoom, onZoomChange])

  // Container size tracker — published via Context so DrawingLayer (or other
  // overlay children) can render uniform stroke/handle/label without consumers
  // having to wire up zoom + size manually.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return
      const { width, height } = entry.contentRect
      setSize((prev) => (prev.w === width && prev.h === height ? prev : { w: width, h: height }))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const ctx = useMemo<ImageViewerContextValue>(
    () => ({ zoom, containerWidth: size.w, containerHeight: size.h }),
    [zoom, size.w, size.h],
  )

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom > 1) startPan(e.clientX, e.clientY, pan.x, pan.y)
    },
    [zoom, pan, startPan],
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => { movePan(e.clientX, e.clientY) },
    [movePan],
  )

  const onDoubleClick = useCallback(() => {
    if (zoom > 1) reset()
  }, [zoom, reset])

  const cursor = isZoomPanning() ? 'grabbing' : zoom > 1 ? 'grab' : 'default'

  return (
    <Wrap
      ref={wrapRef}
      className={className}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endPan}
      onMouseLeave={endPan}
      onDoubleClick={onDoubleClick}
      style={{ cursor }}
    >
      <ZoomLayer $zoom={zoom} $panX={pan.x} $panY={pan.y}>
        <Img src={src} alt={alt} draggable={false} />
        <ImageViewerContext.Provider value={ctx}>
          {children}
        </ImageViewerContext.Provider>
      </ZoomLayer>
    </Wrap>
  )
}

export { useZoomPan } from '../../hooks'
