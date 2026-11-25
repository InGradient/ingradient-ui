import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { AccountSwitchDialog } from './account-switch-dialog'
import { CommentedImagesDialog } from './commented-images-dialog'
import { NoticesDialog } from './notices-dialog'
import { ProjectSwitcherDialog } from './project-switcher-dialog'

const THUMB =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23334155'/%3E%3C/svg%3E"

const meta: Meta = {
  id: 'platform-pages-appshell-dialogs',
  title: 'Components/Platform/AppShell/Dialogs',
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

const NOTICES = [
  { id: 'n1', title: 'You were mentioned', description: 'Alex mentioned you on image_0412.png.', createdAtLabel: 'Today, 10:24', canOpen: true },
  { id: 'n2', title: 'Export finished', description: 'The export of "Sample dataset" is ready.', createdAtLabel: 'Yesterday, 17:02' },
]

export const Notices: Story = {
  render: () => (
    <NoticesDialog open notices={NOTICES} onClose={fn()} onArchive={fn().mockName('onArchive')} onOpen={fn().mockName('onOpen')} />
  ),
}
export const NoticesEmpty: Story = { render: () => <NoticesDialog open notices={[]} onClose={fn()} onArchive={fn()} /> }
export const NoticesLoading: Story = { render: () => <NoticesDialog open loading notices={[]} onClose={fn()} onArchive={fn()} /> }

const COMMENTED = [
  { imageId: 'i1', imageName: 'image_0412.png', thumbUrl: THUMB, datasetName: 'Sample dataset', latestAtLabel: 'Today, 10:24', latestAuthor: 'Alex Kim', latestPreview: 'This box looks too wide on the left edge.', commentCount: 3 },
  { imageId: 'i2', imageName: 'a-very-long-image-file-name-that-should-truncate-in-the-row-title-0001.png', thumbUrl: THUMB, latestAtLabel: 'Yesterday, 09:10', latestAuthor: 'sam@example.com', latestPreview: 'Relabeled.', commentCount: 1 },
]

export const CommentedImages: Story = {
  render: () => <CommentedImagesDialog open items={COMMENTED} onClose={fn()} onOpenImage={fn().mockName('onOpenImage')} />,
}
export const CommentedImagesEmpty: Story = {
  render: () => <CommentedImagesDialog open items={[]} onClose={fn()} onOpenImage={fn()} />,
}

const PROJECTS = [
  { id: 'p1', name: 'Sample project', description: 'Surface inspection, line A' },
  { id: 'p2', name: 'Another project' },
]

export const ProjectSwitcher: Story = {
  render: () => (
    <ProjectSwitcherDialog open projects={PROJECTS} currentId="p1" onClose={fn()} onSelect={fn().mockName('onSelect')} onCreate={fn().mockName('onCreate')} />
  ),
}
/** No projects and a selection is required: the dialog has no close button. */
export const ProjectSwitcherFirstProject: Story = {
  render: () => <ProjectSwitcherDialog open requireSelection projects={[]} onClose={fn()} onSelect={fn()} onCreate={fn()} />,
}

export const AccountSwitch: Story = {
  render: () => (
    <AccountSwitchDialog open accounts={['alex@example.com', 'sam@example.com']} currentEmail="alex@example.com" onClose={fn()} onSelect={fn().mockName('onSelect')} />
  ),
}
export const AccountSwitchEmpty: Story = {
  render: () => <AccountSwitchDialog open accounts={[]} onClose={fn()} onSelect={fn()} />,
}
