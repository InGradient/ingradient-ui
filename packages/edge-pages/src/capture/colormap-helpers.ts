export type ColormapName =
  | 'grayscale'
  | 'hsv' | 'turbo' | 'viridis' | 'jet'
  | 'magma' | 'inferno' | 'plasma'
  | 'hot' | 'cool' | 'parula'

export type DerivedKind = 'gradient' | 'modulation'

export const COLORMAP_OPTIONS: readonly { value: ColormapName; label: string }[] = [
  { value: 'grayscale', label: 'Grayscale' },
  { value: 'turbo',   label: 'Turbo' },
  { value: 'viridis', label: 'Viridis' },
  { value: 'hsv',     label: 'HSV' },
  { value: 'jet',     label: 'Jet' },
  { value: 'magma',   label: 'Magma' },
  { value: 'inferno', label: 'Inferno' },
  { value: 'plasma',  label: 'Plasma' },
  { value: 'hot',     label: 'Hot' },
  { value: 'cool',    label: 'Cool' },
  { value: 'parula',  label: 'Parula' },
] as const

export const DEFAULT_COLORMAPS: Record<DerivedKind, ColormapName> = {
  gradient:   'turbo',
  modulation: 'viridis',
}

export function labelToDerivedKind(label: string | null | undefined): DerivedKind | null {
  if (!label) return null
  if (label.startsWith('derived_gradient_')) return 'gradient'
  if (label === 'derived_modulation') return 'modulation'
  return null
}
