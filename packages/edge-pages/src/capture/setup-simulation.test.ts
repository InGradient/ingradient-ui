import { createElement, useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { fringeValues, sequenceSummary } from '../../../../stories/pages/edge/0.0.5/workspace/build-setup-content'
import { SETUP_CONFIG, SETUP_PANEL_LABELS } from '../../../../stories/fixtures/edge/0.0.5/setup'
import { DeflectometrySection } from './setup-sections/DeflectometrySection'

describe('setup simulation derivation', () => {
  it('allows clearing and replacing gamma without restoring a fallback between keystrokes', async () => {
    const user = userEvent.setup()
    function ControlledSection() {
      const [config, setConfig] = useState(SETUP_CONFIG)
      return createElement('div', null,
        createElement(DeflectometrySection, { setupConfig: config, disabled: false, isMeasuringSettleDelay: false, sequenceSummary: sequenceSummary(config), phaseStepOptions: [4, 16], labels: SETUP_PANEL_LABELS, onSetSetupConfig: setConfig, onMeasureSettleDelay: () => undefined }),
        createElement('output', { 'aria-label': 'Published gamma' }, config.gamma),
        createElement('button', { onClick: () => setConfig(SETUP_CONFIG) }, 'Reset'),
      )
    }
    render(createElement(ControlledSection))
    const gamma = screen.getByRole('spinbutton', { name: 'Gamma' })
    await user.clear(gamma)
    expect(gamma).toHaveValue(null)
    await user.type(gamma, '3')
    expect(gamma).toHaveValue(3)
    expect(screen.getByLabelText('Published gamma')).toHaveTextContent('3')
    await user.clear(gamma)
    await user.tab()
    expect(gamma).toHaveValue(3)
    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(gamma).toHaveValue(2.2)
  })
  it('recomputes the profile from gamma, period and brightness bounds', () => {
    const original = fringeValues(SETUP_CONFIG)
    expect(fringeValues({ ...SETUP_CONFIG, gamma: 3 })).not.toEqual(original)
    expect(fringeValues({ ...SETUP_CONFIG, fringePeriod: 48 })).not.toEqual(original)
    const dark = fringeValues({ ...SETUP_CONFIG, minBrightness: 0, maxBrightness: 0 })
    expect(dark.every((value) => value === 0)).toBe(true)
    expect(original).toHaveLength(256)
  })
  it('recomputes two-direction-plus-solid totals with an explicit fixture default', () => {
    expect(sequenceSummary({ ...SETUP_CONFIG, phaseSteps: 4 })).toContain('total 9 patterns (simulation)')
    expect(sequenceSummary({ ...SETUP_CONFIG, phaseSteps: null })).toContain('total 33 patterns (simulation)')
  })
})
