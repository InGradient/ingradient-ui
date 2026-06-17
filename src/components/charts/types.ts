export { chartPalette } from '../../tokens/semantic/states'
import { typographyScale } from '../../tokens/core'

export const chartAxisTick = {
  fill: 'var(--ig-color-text-soft)',
  fontSize: parseInt(typographyScale.size3xs, 10), // 10px
  fontWeight: typographyScale.weightMedium, // 500
} as const

export interface CartesianSeries {
  key: string
  label: string
  color?: string
}

export interface PieDatum {
  name: string
  value: number
  color?: string
}
