import React from 'react'
import type { DrawingObject, DrawingPreview } from '../../hooks/useDrawingCanvas'

export type { DrawingObject, DrawingPreview } from '../../hooks/useDrawingCanvas'

export interface DrawingLayerProps {
  objects: DrawingObject[]
  selectedId?: string | null
  drawingPreview?: DrawingPreview | null
  showHandles?: boolean
  showLabels?: boolean
  showCrosshair?: boolean
  cursorX?: number
  cursorY?: number
}

const HANDLE_R = 4

export function DrawingLayer({
  objects, selectedId, drawingPreview,
  showHandles = true, showLabels = false,
  showCrosshair = false, cursorX, cursorY,
}: DrawingLayerProps) {
  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
    >
      {/* Crosshair */}
      {showCrosshair && cursorX != null && cursorY != null && (
        <>
          <line x1={cursorX} y1={0} x2={cursorX} y2={1} stroke="rgba(255,255,255,0.3)" strokeWidth={0.001} strokeDasharray="0.004 0.004" />
          <line x1={0} y1={cursorY} x2={1} y2={cursorY} stroke="rgba(255,255,255,0.3)" strokeWidth={0.001} strokeDasharray="0.004 0.004" />
        </>
      )}

      {/* Drawing preview */}
      {drawingPreview && (
        <rect
          x={drawingPreview.x}
          y={drawingPreview.y}
          width={drawingPreview.w}
          height={drawingPreview.h}
          fill="rgba(74,158,255,0.15)"
          stroke="#4a9eff"
          strokeWidth={0.002}
          strokeDasharray="0.006 0.004"
        />
      )}

      {/* Objects */}
      {objects.map((obj) => {
        const isSelected = obj.id === selectedId
        const color = obj.color ?? '#4a9eff'

        if (obj.type === 'rect' && obj.w != null && obj.h != null) {
          return (
            <g key={obj.id}>
              <rect
                x={obj.x}
                y={obj.y}
                width={obj.w}
                height={obj.h}
                fill={isSelected ? `${color}22` : `${color}11`}
                stroke={color}
                strokeWidth={isSelected ? 0.003 : 0.002}
              />
              {showLabels && obj.label && (
                <text
                  x={obj.x + 0.004}
                  y={obj.y - 0.006}
                  fill={color}
                  fontSize={0.018}
                  fontWeight={600}
                  style={{ pointerEvents: 'none' }}
                >
                  {obj.label}
                </text>
              )}
              {showHandles && isSelected && (
                <>
                  {[
                    [obj.x, obj.y],
                    [obj.x + obj.w, obj.y],
                    [obj.x, obj.y + obj.h],
                    [obj.x + obj.w, obj.y + obj.h],
                  ].map(([cx, cy], i) => (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r={HANDLE_R / 1000}
                      fill="#fff"
                      stroke={color}
                      strokeWidth={0.002}
                    />
                  ))}
                </>
              )}
            </g>
          )
        }

        if (obj.type === 'point') {
          return (
            <circle
              key={obj.id}
              cx={obj.x}
              cy={obj.y}
              r={isSelected ? 0.008 : 0.006}
              fill={color}
              stroke={isSelected ? '#fff' : 'none'}
              strokeWidth={0.002}
            />
          )
        }

        return null
      })}
    </svg>
  )
}
