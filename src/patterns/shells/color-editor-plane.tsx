import type React from 'react'
import styled from 'styled-components'
import type { HslColor } from './color-input-row.utils'

const Plane = styled.div<{ $hue: number }>`
  position: relative;
  height: 120px;
  margin-bottom: var(--ig-space-5);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-md);
  background:
    linear-gradient(180deg, var(--ig-color-white-96), transparent 50%, var(--ig-color-bg-canvas)),
    linear-gradient(90deg, hsl(${(p) => p.$hue} 0% 50%), hsl(${(p) => p.$hue} 100% 50%));
  box-shadow: inset 0 1px 0 var(--ig-color-inset-highlight);
  cursor: crosshair;
  overflow: hidden;
  touch-action: none;

  &:focus-visible {
    outline: 2px solid var(--ig-color-accent-ring);
    outline-offset: 2px;
  }
`

const Thumb = styled.span<{ $saturation: number; $lightness: number }>`
  position: absolute;
  left: ${(p) => p.$saturation}%;
  top: ${(p) => 100 - p.$lightness}%;
  width: 18px;
  height: 18px;
  border: 2px solid var(--ig-color-text-primary);
  border-radius: 50%;
  box-shadow: var(--ig-shadow-focus-ring);
  transform: translate(-50%, -50%);
  pointer-events: none;
`

const clamp = (value: number) => Math.min(100, Math.max(0, value))

export interface ColorEditorPlaneProps {
  color: HslColor
  onChange: (color: HslColor) => void
}

export function ColorEditorPlane({ color, onChange }: ColorEditorPlaneProps) {
  const pick = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const saturation = clamp(((event.clientX - rect.left) / rect.width) * 100)
    const lightness = clamp(100 - ((event.clientY - rect.top) / rect.height) * 100)
    onChange({ ...color, s: Math.round(saturation), l: Math.round(lightness) })
  }

  return (
    <Plane
      role="slider"
      aria-label="Saturation and lightness"
      aria-valuetext={`Saturation ${color.s}, lightness ${color.l}`}
      tabIndex={0}
      $hue={color.h}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture?.(event.pointerId)
        pick(event)
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture?.(event.pointerId)) return
        pick(event)
      }}
      onPointerUp={(event) => event.currentTarget.releasePointerCapture?.(event.pointerId)}
    >
      <Thumb $saturation={color.s} $lightness={color.l} />
    </Plane>
  )
}
