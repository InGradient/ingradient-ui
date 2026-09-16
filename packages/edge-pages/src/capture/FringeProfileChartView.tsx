import { useId } from 'react'

/**
 * 프린지 프로파일 차트 — 위는 줄무늬 겉모습, 아래는 밝기 곡선.
 * 미리보기(작게)와 확대(크게)가 같은 컴포넌트를 크기만 바꿔 쓴다.
 *
 * 값 계산(주기·감마·밝기 범위 → 표본)은 촬영 백엔드와 같은 순서를 따라야 하므로 앱이 한다.
 * 여기서는 받은 표본을 그리기만 한다.
 */
export interface FringeProfileChartViewProps {
  /** 표본별 8bit 밝기 (LUT 통과 후). */
  values: number[]
  /** 이 그래프가 덮는 화면 픽셀 구간 — 가로축 눈금 숫자로 쓴다. */
  windowPx: number
  stripeHeight: number
  plotHeight: number
  /** 확대할 때만 축 눈금·숫자를 넣는다 — 작게 그리면 겹친다. */
  showAxis?: boolean
}

const VB_W = 260
const GAP = 6
/** showAxis 일 때 좌측 눈금 숫자가 들어갈 자리. */
const AXIS_PAD = 22
const LEVELS = [0, 128, 255]

export function FringeProfileChartView(props: FringeProfileChartViewProps): JSX.Element {
  const { values, windowPx, stripeHeight, plotHeight, showAxis = false } = props

  // defs 의 id 는 문서 전체에서 유일해야 한다 — 미리보기와 확대가 동시에 떠 있으면
  // 같은 id 를 쓰는 순간 한쪽 그라디언트가 다른 쪽을 덮는다.
  const gradientId = `ig-fringe-${useId()}`
  const left = showAxis ? AXIS_PAD : 0
  const w = VB_W - left
  const plotTop = stripeHeight + GAP
  const totalH = plotTop + plotHeight + (showAxis ? 12 : 0)
  const yOf = (v: number): number => plotTop + plotHeight - (v / 255) * plotHeight
  const points = values.map((v, i) => (
    `${(left + (i / (values.length - 1)) * w).toFixed(2)},${yOf(v).toFixed(2)}`
  )).join(' ')

  return (
    <svg viewBox={`0 0 ${VB_W} ${totalH}`} width="100%" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          {values.map((v, i) => (
            <stop
              key={i}
              offset={`${(i / (values.length - 1)) * 100}%`}
              stopColor={`rgb(${v},${v},${v})`}
            />
          ))}
        </linearGradient>
      </defs>

      <rect x={left} y="0" width={w} height={stripeHeight} fill={`url(#${gradientId})`} />

      {LEVELS.map((level) => (
        <line
          key={level}
          x1={left} y1={yOf(level)} x2={VB_W} y2={yOf(level)}
          stroke="var(--ig-color-border-subtle)" strokeWidth={showAxis ? 0.4 : 0.5}
        />
      ))}
      {showAxis && LEVELS.map((level) => (
        <text
          key={level}
          x={left - 4} y={yOf(level) + 2.5}
          textAnchor="end" fontSize="6" fill="var(--ig-color-text-muted)"
        >
          {level}
        </text>
      ))}

      <polyline
        points={points}
        fill="none"
        stroke="var(--ig-color-accent)"
        strokeWidth={showAxis ? 1 : 1.5}
        strokeLinejoin="round"
      />

      {showAxis && [0, 0.5, 1].map((fraction) => (
        <text
          key={fraction}
          x={left + fraction * w} y={totalH - 2}
          textAnchor={fraction === 0 ? 'start' : fraction === 1 ? 'end' : 'middle'}
          fontSize="6" fill="var(--ig-color-text-muted)"
        >
          {Math.round(fraction * windowPx)}
        </text>
      ))}
    </svg>
  )
}
