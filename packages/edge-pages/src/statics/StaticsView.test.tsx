import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { StaticsView } from './StaticsView'
import { SAMPLE_IMAGE_ANALYTICS, SAMPLE_SESSION_ANALYTICS, STATICS_LABELS } from '../../../../stories/fixtures/edge/0.0.5/temp-statics'

vi.mock('./SessionChartsView', () => ({ SessionChartsView: () => <button>Session chart control</button> }))
vi.mock('./ImageChartsView', () => ({ ImageChartsView: () => <button>Image chart control</button> }))
vi.mock('./LabelingChartsView', () => ({ LabelingChartsView: () => <button>Labeling chart control</button> }))
vi.mock('./CameraChartsView', () => ({ CameraChartsView: () => <button>Camera chart control</button> }))

const props = {
  hasDataset: true, loading: false, imagesLoading: false,
  session: SAMPLE_SESSION_ANALYTICS, enhancedImage: SAMPLE_IMAGE_ANALYTICS,
  classNameMap: new Map<string, string>(), classes: [], images: [],
  collapsedSections: {}, trendMode: 'daily7' as const, labels: STATICS_LABELS,
  onToggleSection: vi.fn(), onTrendModeChange: vi.fn(),
}

describe('Statics section disclosures', () => {
  it.each(['sessions', 'images', 'labeling', 'camera'] as const)('links the %s toggle to its controlled visibility', (key) => {
    const toggle = vi.fn()
    const { rerender } = render(<StaticsView {...props} onToggleSection={toggle} />)
    const header = screen.getByRole('button', { name: STATICS_LABELS[key] })
    const content = document.getElementById(header.getAttribute('aria-controls')!)!
    expect(header).toHaveAttribute('type', 'button')
    expect(header).toHaveAttribute('aria-expanded', 'true')
    expect(content).toBeVisible()
    fireEvent.click(header)
    expect(toggle).toHaveBeenCalledWith(key)
    rerender(<StaticsView {...props} collapsedSections={{ [key]: true }} onToggleSection={toggle} />)
    expect(header).toHaveAttribute('aria-expanded', 'false')
    expect(content).toHaveAttribute('hidden')
    expect(content).not.toBeVisible()
    rerender(<StaticsView {...props} onToggleSection={toggle} />)
    expect(header).toHaveAttribute('aria-expanded', 'true')
    expect(content).toBeVisible()
  })
  it('uses instance-unique panel ids', () => {
    render(<><StaticsView {...props} /><StaticsView {...props} /></>)
    const ids = screen.getAllByRole('button', { name: STATICS_LABELS.sessions }).map((button) => button.getAttribute('aria-controls'))
    expect(new Set(ids).size).toBe(2)
  })
})
