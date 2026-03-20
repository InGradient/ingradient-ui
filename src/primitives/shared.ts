export type Space = number | string

export function space(value?: Space): string | undefined {
  if (value == null) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

export function numberOrString(value?: number | string): string | undefined {
  if (value == null) return undefined
  return typeof value === 'number' ? `${value}px` : value
}
