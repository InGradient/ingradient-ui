import { it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ExperimentsTabView } from './ExperimentsTabView'
import { EXPERIMENTS_TAB_LABELS } from '../../../../../stories/fixtures/edge/0.0.5/settings'

it('names both experiment switches without nested labels', () => {
  const { container } = render(<ExperimentsTabView enabled fringePeriods={[8]} primaryIndex={0} compositeEnabled compositeSteps={3} limits={{ minPeriod: 1, maxPeriods: 5, maxCompositeSteps: 10 }} labels={EXPERIMENTS_TAB_LABELS} onToggleEnabled={vi.fn()} onChangePeriod={vi.fn()} onAddPeriod={vi.fn()} onRemovePeriod={vi.fn()} onToggleComposite={vi.fn()} onChangeCompositeSteps={vi.fn()} />)
  expect(container.querySelector('label label')).toBeNull()
  expect(screen.getByRole('checkbox', { name: EXPERIMENTS_TAB_LABELS.enabledLabel })).toBeChecked()
  expect(screen.getByRole('checkbox', { name: EXPERIMENTS_TAB_LABELS.compositeLabel })).toBeChecked()
})
