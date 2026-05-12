export { chartPalette } from '../../tokens/semantic/states'

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
