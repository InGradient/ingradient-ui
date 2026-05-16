export interface PieSliceLabelProps {
  cx?: number
  cy?: number
  midAngle?: number
  innerRadius?: number
  outerRadius?: number
  percent?: number
  name?: string
  value?: number
}

const MIN_VISIBLE_PERCENT = 0.06
const LABEL_RADIUS_RATIO = 0.56

/**
 * Recharts `<Pie label={renderPieSliceLabel}>` 호환 — 슬라이스 중앙에 name + value 2줄.
 * percent < 6% 은 라벨 생략.
 */
export function renderPieSliceLabel(props: PieSliceLabelProps) {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    percent = 0,
    name = '',
    value = 0,
  } = props
  if (percent < MIN_VISIBLE_PERCENT) return null

  const radius = innerRadius + (outerRadius - innerRadius) * LABEL_RADIUS_RATIO
  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

  return (
    <text x={x} y={y} fill="#eef4ff" textAnchor="middle" dominantBaseline="central">
      <tspan x={x} dy="-0.2em" fontSize="11" fontWeight="700">
        {name}
      </tspan>
      <tspan x={x} dy="1.2em" fontSize="10" fill="rgba(238, 244, 255, 0.86)">
        {value.toLocaleString()}
      </tspan>
    </text>
  )
}
