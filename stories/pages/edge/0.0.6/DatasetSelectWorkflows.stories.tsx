// Dataset workflows: add, create project, export and session expiry.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { paced } from '../../../support/paced-play'
import Dataset005, * as D from '../0.0.5/DatasetSelect.stories'
import { edge006Parameters } from './edge-006'

const meta = {
  title: 'Pages/Edge/0.0.6/Dataset Select/Workflows',
  component: Dataset005.component,
  args: Dataset005.args,
  tags: ['!autodocs'],
  parameters: edge006Parameters({
    page: 'Dataset Select',
    referenceStory: 'Pages / Edge / 0.0.6 / Dataset Select / Workflows / Add dataset',
    fixturesPath: 'stories/fixtures/edge/0.0.5/datasets.ts',
    requiredScenarios: ['add-dataset', 'add-dataset-cancel', 'create-project', 'export-retry', 'export-cancel', 'session-expired-confirm', 'session-expired-cancel', 'session-expired-escape'],
    interactions: ['Validated local forms, pending state, created fixture and focus restoration; no file writes'],
  }),
} satisfies Meta<typeof Dataset005.component>

export default meta
type Story = StoryObj<typeof meta.component>

export const AddDataset: Story = { ...D.AddDatasetWorkflow, name: 'Add dataset', play: paced(D.AddDatasetWorkflow.play) }
export const AddDatasetCancel: Story = { ...D.AddDatasetCancelWorkflow, name: 'Add dataset → cancel', play: paced(D.AddDatasetCancelWorkflow.play) }
export const CreateProject: Story = { ...D.CreateProjectWorkflow, name: 'Create project', play: paced(D.CreateProjectWorkflow.play) }
export const ExportRetry: Story = { ...D.ExportRetryWorkflow, name: 'Export → fail → retry', play: paced(D.ExportRetryWorkflow.play) }
export const ExportCancel: Story = { ...D.ExportCancelWorkflow, name: 'Export → cancel', play: paced(D.ExportCancelWorkflow.play) }
export const SessionExpiredConfirm: Story = { ...D.SessionExpiredConfirmWorkflow, name: 'Session expired → sign in', play: paced(D.SessionExpiredConfirmWorkflow.play) }
export const SessionExpiredCancel: Story = { ...D.SessionExpiredCancelWorkflow, name: 'Session expired → cancel', play: paced(D.SessionExpiredCancelWorkflow.play) }
export const SessionExpiredEscape: Story = { ...D.SessionExpiredEscapeWorkflow, name: 'Session expired → Escape', play: paced(D.SessionExpiredEscapeWorkflow.play) }
