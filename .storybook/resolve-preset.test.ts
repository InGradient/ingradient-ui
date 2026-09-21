import { describe, expect, it } from 'vitest'
import { edgeV001, medicalV001, platformV001 } from '../src/tokens'
import { resolvePreset } from './resolve-preset'

// Keep Storybook metadata policy out of the published token API.
describe('Storybook preset resolution', () => {
  it('uses the declared design preset independently of the story composition version', () => {
    expect(resolvePreset({ service: 'edge', version: '0.0.5', preset: 'edge-0.0.1' })).toBe(edgeV001)
    expect(resolvePreset({ preset: 'edge-0.0.1' })).toBe(edgeV001)
  })

  it.each([platformV001, edgeV001, medicalV001])('preserves $service service/version and sandbox defaults', (preset) => {
    expect(resolvePreset({ service: preset.service, version: '0.0.1' })).toBe(preset)
    expect(resolvePreset({ service: preset.service })).toBe(preset)
  })

  it.each([undefined, {}, { service: 'none' }, { service: 'unknown' },
    { service: 'edge', version: '0.0.5' }, { service: 'platform', version: 'future' },
    { service: 'constructor' }])('does not invent a preset for %j', (handoff) => {
    expect(resolvePreset(handoff)).toBeUndefined()
  })

  it.each(['edge-0.0.5', 'missing', '', 'constructor', '__proto__'])('rejects unknown explicit preset %s instead of falling back', (preset) => {
    expect(() => resolvePreset({ service: 'edge', version: '0.0.1', preset })).toThrow('Unknown handoff.preset')
  })

  it.each(['platform', 'medical', 'none', 'unknown'])('rejects an explicit Edge preset for %s', (service) => {
    expect(() => resolvePreset({ service, preset: 'edge-0.0.1' })).toThrow('does not belong to service')
  })
})
