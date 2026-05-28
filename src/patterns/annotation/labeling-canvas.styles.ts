import styled from 'styled-components'

export const LabelingCanvasWrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: var(--ig-color-bg-canvas);
  display: flex;
  align-items: center;
  justify-content: center;
`

/** ZoomWrap — pan + scale 적용. *will-change / transition 의도적으로 제거*.
 *  will-change: transform 은 GPU 레이어로 promote 되어 SVG 가 intrinsic
 *  해상도에서 rasterize 후 upscale → DrawingLayer label 텍스트 blur. platform/
 *  edge 의 ZoomWrap 도 둘 다 없는 패턴 — 동일하게 유지. */
export const ZoomWrap = styled.div<{ $zoom: number; $panX: number; $panY: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transform: ${(p) => `translate(${p.$panX}px, ${p.$panY}px) scale(${p.$zoom})`};
  transform-origin: center center;
`

export const ImageAreaWrap = styled.div<{ $aspect: number }>`
  position: relative;
  max-width: 100%;
  max-height: 100%;
  aspect-ratio: ${(p) => p.$aspect};
  flex-shrink: 0;
`

export const LabelingImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  user-select: none;
`

export const CaptureLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: var(--ig-z-capture);
`
