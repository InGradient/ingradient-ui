export { chartPalette } from '../../tokens/semantic/states'

export const chartAxisTick = {
  fill: 'var(--ig-color-text-soft)',
  fontSize: 10,
  fontWeight: 500,
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
