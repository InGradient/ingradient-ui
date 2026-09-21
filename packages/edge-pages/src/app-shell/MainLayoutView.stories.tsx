import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'
import { Tabs } from '@ingradient/ui/components'
import { breakpoints } from '@ingradient/ui/tokens'
import { MainLayoutView } from './MainLayoutView'

const meta = {
  title: 'Edge Pages/App Shell/MainLayout', component: MainLayoutView,
  parameters: { layout: 'fullscreen', a11y: { test: 'error' }, docs: { description: { component: 'Desktop constrained-width policy: the central workspace retains the existing 640px dimension token; the panels region scrolls horizontally rather than clipping tabs or inventing a mobile shell. Initial constrained layout reveals the center. Side panels remain available through scrolling and native keyboard focus.' } } },
} satisfies Meta<typeof MainLayoutView>
export default meta
type Story = StoryObj<typeof meta>

function DesktopDemo() {
  const [tab, setTab] = useState('Capture')
  return <div style={{ width: breakpoints.md, maxWidth: '100%', height: 'var(--ig-popup-3xl-mid)' }}>
    <MainLayoutView isCapturing={false} topBar={<span>Desktop workspace</span>}
      leftPanel={<button type="button">Log filter</button>}
      rightPanel={<aside aria-label="Patterns"><button type="button">Pattern selection</button></aside>}
      centerContent={<>
        <Tabs items={['Capture', 'Images', 'Statics', 'Setup'].map((value) => ({ value, label: value }))} value={tab} onChange={setTab} />
        <p>{tab} workspace</p><button type="button">Workspace action</button>
      </>} />
  </div>
}

export const ConstrainedDesktop: Story = {
  render: () => <DesktopDemo />,
  play: async ({ canvas, userEvent }) => {
    const region = canvas.getByRole('group', { name: 'Workspace panels' })
    const withinRegion = (element: HTMLElement) => {
      const bounds = region.getBoundingClientRect()
      const item = element.getBoundingClientRect()
      expect(item.left).toBeGreaterThanOrEqual(bounds.left)
      expect(item.right).toBeLessThanOrEqual(bounds.right)
    }
    await waitFor(() => {
      expect(region.scrollWidth).toBeGreaterThan(region.clientWidth)
      withinRegion(canvas.getByRole('tablist').parentElement!)
      for (const tab of canvas.getAllByRole('tab')) withinRegion(tab)
    })
    canvas.getByRole('tab', { name: 'Capture' }).focus()
    await userEvent.keyboard('{End}')
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Setup' })).toHaveFocus())
    await expect(canvas.getByRole('tab', { name: 'Setup' })).toHaveAttribute('aria-selected', 'true')
    withinRegion(canvas.getByRole('tab', { name: 'Setup' }))
    await userEvent.keyboard('{ArrowLeft}')
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Statics' })).toHaveFocus())
    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'Workspace action' })).toHaveFocus()
    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'Pattern selection' })).toHaveFocus()
    withinRegion(canvas.getByRole('button', { name: 'Pattern selection' }))
    await userEvent.tab({ shift: true })
    await userEvent.tab({ shift: true })
    await userEvent.tab({ shift: true })
    await expect(canvas.getByRole('button', { name: 'Log filter' })).toHaveFocus()
    withinRegion(canvas.getByRole('button', { name: 'Log filter' }))
    await userEvent.tab()
    await expect(canvas.getByRole('tab', { name: 'Statics' })).toHaveFocus()
    withinRegion(canvas.getByRole('tablist').parentElement!)
  },
}
