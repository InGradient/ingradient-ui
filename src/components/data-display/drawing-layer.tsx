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
  /** Container pixel width — enables uniform stroke/handle rendering */
  containerWidth?: number
  /** Container pixel height — enables uniform stroke/handle rendering */
  containerHeight?: number
  /** Color for the drawing preview (defaults to #4a9eff) */
  previewColor?: string
  /** Color for the crosshair lines (defaults to rgba(255,255,255,0.3)) */
  crosshairColor?: string
}

const HANDLE_PX = 4
const POINT_PX = 5
const POINT_SELECTED_PX = 7
const STROKE_PX = 1.5
const STROKE_SELECTED_PX = 2.5
const LABEL_FONT_PX = 11
const LABEL_PAD_X = 5
const LABEL_PAD_Y = 3
const LABEL_HEIGHT = LABEL_FONT_PX + LABEL_PAD_Y * 2
const LABEL_RADIUS = 3

export function DrawingLayer({
  objects, selectedId, drawingPreview,
  showHandles = true, showLabels = false,
  showCrosshair = false, cursorX, cursorY,
  containerWidth, containerHeight,
  previewColor = '#4a9eff',
  crosshairColor,
}: DrawingLayerProps) {
  const cw = containerWidth || 0
  const ch = containerHeight || 0
  const uniform = cw > 0 && ch > 0

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
      {showCrosshair && cursorX != null && cursorY != null && (() => {
        const chColor = crosshairColor ?? 'rgba(255,255,255,0.3)'
        return (
          <>
            <line
              x1={cursorX} y1={0} x2={cursorX} y2={1}
              stroke={chColor}
              strokeWidth={uniform ? 1 : 0.001}
              strokeDasharray={uniform ? '4 4' : '0.004 0.004'}
              vectorEffect={uniform ? 'non-scaling-stroke' : undefined}
            />
            <line
              x1={0} y1={cursorY} x2={1} y2={cursorY}
              stroke={chColor}
              strokeWidth={uniform ? 1 : 0.001}
              strokeDasharray={uniform ? '4 4' : '0.004 0.004'}
              vectorEffect={uniform ? 'non-scaling-stroke' : undefined}
            />
          </>
        )
      })()}

      {/* Drawing preview */}
      {drawingPreview && (
        <rect
          x={drawingPreview.x}
          y={drawingPreview.y}
          width={drawingPreview.w}
          height={drawingPreview.h}
          fill={`${previewColor}26`}
          stroke={previewColor}
          strokeWidth={uniform ? 1.5 : 0.002}
          strokeDasharray={uniform ? '6 4' : '0.006 0.004'}
          vectorEffect={uniform ? 'non-scaling-stroke' : undefined}
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
                strokeWidth={uniform ? (isSelected ? STROKE_SELECTED_PX : STROKE_PX) : (isSelected ? 0.003 : 0.002)}
                vectorEffect={uniform ? 'non-scaling-stroke' : undefined}
              />
              {showLabels && obj.label && (
                uniform ? (
                  <g transform={`translate(${obj.x}, ${obj.y}) scale(${1 / cw}, ${1 / ch})`}>
                    <rect
                      x={0}
                      y={-LABEL_HEIGHT}
                      width={obj.label.length * LABEL_FONT_PX * 0.58 + LABEL_PAD_X * 2}
                      height={LABEL_HEIGHT}
                      rx={LABEL_RADIUS}
                      fill={color}
                      opacity={0.85}
                    />
                    <text
                      x={LABEL_PAD_X}
                      y={-LABEL_PAD_Y}
                      fill="#fff"
                      fontSize={LABEL_FONT_PX}
                      fontWeight={600}
                      fontFamily="sans-serif"
                      style={{ pointerEvents: 'none' }}
                    >
                      {obj.label}
                    </text>
                  </g>
                ) : (
                  <text
                    x={obj.x + 0.003}
                    y={obj.y - 0.004}
                    fill={color}
                    fontSize={0.014}
                    fontFamily="sans-serif"
                    style={{ pointerEvents: 'none' }}
                  >
                    {obj.label}
                  </text>
                )
              )}
              {showHandles && isSelected && (
                <>
                  {([
                    [obj.x, obj.y],
                    [obj.x + obj.w, obj.y],
                    [obj.x, obj.y + obj.h],
                    [obj.x + obj.w, obj.y + obj.h],
                  ] as [number, number][]).map(([cx, cy], i) => (
                    uniform ? (
                      <ellipse
                        key={i}
                        cx={cx}
                        cy={cy}
                        rx={HANDLE_PX / cw}
                        ry={HANDLE_PX / ch}
                        fill="#fff"
                        stroke={color}
                        strokeWidth={1.5}
                        vectorEffect="non-scaling-stroke"
                      />
                    ) : (
                      <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={HANDLE_PX / 1000}
                        fill="#fff"
                        stroke={color}
                        strokeWidth={0.002}
                      />
                    )
                  ))}
                </>
              )}
            </g>
          )
        }

        if (obj.type === 'point') {
          const size = isSelected ? POINT_SELECTED_PX : POINT_PX
          return uniform ? (
            <ellipse
              key={obj.id}
              cx={obj.x}
              cy={obj.y}
              rx={size / cw}
              ry={size / ch}
              fill={color}
              stroke={isSelected ? '#fff' : 'none'}
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          ) : (
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
