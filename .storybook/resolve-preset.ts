import { edgeV001, medicalV001, platformV001, type Preset } from '../src/tokens'

export interface PresetHandoff {
  service?: string
  version?: string
  preset?: string
}

const presets: readonly Preset[] = [platformV001, edgeV001, medicalV001]

/** Story versions describe composition; an explicit preset identifies the design contract. */
export function resolvePreset(handoff?: PresetHandoff): Preset | undefined {
  if (handoff?.preset !== undefined) {
    const preset = presets.find(({ id }) => id === handoff.preset)
    if (!preset) throw new Error(`Unknown handoff.preset: ${String(handoff.preset)}`)
    if (handoff.service !== undefined && handoff.service !== preset.service) {
      throw new Error(`handoff.preset ${preset.id} does not belong to service ${handoff.service}`)
    }
    return preset
  }

  // Missing versions retain the existing service sandbox default. Unknown versions stay unstyled.
  return presets.find(({ service, version }) =>
    service === handoff?.service && version === (handoff?.version ?? '0.0.1'))
}
