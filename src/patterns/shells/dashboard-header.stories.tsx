import type { Meta, StoryObj } from '@storybook/react-vite'
import { DashboardHeader } from './dashboard-header'
import { Button } from '../../components/inputs/button'

const meta: Meta<typeof DashboardHeader> = {
  title: 'Patterns/Shells/DashboardHeader',
  component: DashboardHeader,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ background: 'var(--ig-color-bg-canvas)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const noop = () => undefined

const actions = (
  <>
    <Button variant="solid" type="button" onClick={noop}>Save PDF</Button>
    <Button variant="secondary" type="button" onClick={noop}>Customize</Button>
  </>
)

export const Default: Story = { args: { projectName: 'Wafer-2026', actions } }

export const NoProject: Story = { args: { actions } }

export const WithSaveMessage: Story = {
  args: { projectName: 'Wafer-2026', saveMessage: 'PDF saved.', actions },
}

export const TitleOnly: Story = { args: { projectName: 'Wafer-2026' } }

export const LongProjectName: Story = {
  args: { projectName: 'Very long project name that wraps onto multiple lines if narrow', actions },
}
