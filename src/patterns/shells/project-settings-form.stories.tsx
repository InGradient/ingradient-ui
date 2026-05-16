import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProjectSettingsForm, type GroupVisible } from './project-settings-form'
import type { ProjectSettingsFormProps } from './project-settings-form'

const noop = () => undefined
const baseArgs: ProjectSettingsFormProps = {
  projectType: 'general',
  canEdit: true,
  isOwner: true,
  saveState: 'idle',
  nameInvalid: false,
  name: 'Wafer line A',
  onChangeName: noop,
  description: 'Production line A defect labeling.',
  onChangeDescription: noop,
  groupEnabled: false, onChangeGroupEnabled: noop,
  groupRegex: '', onChangeGroupRegex: noop,
  groupRepRegex: '', onChangeGroupRepRegex: noop,
  allowDup: false, onChangeAllowDup: noop,
  showFilenameInGallery: true, onChangeShowFilenameInGallery: noop,
  showBboxClassNamesInDetail: true, onChangeShowBboxClassNamesInDetail: noop,
  groupVisible: 'all' as GroupVisible, onChangeGroupVisible: noop,
}

const meta: Meta<typeof ProjectSettingsForm> = {
  title: 'Patterns/Shells/ProjectSettingsForm',
  component: ProjectSettingsForm,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 760, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { args: baseArgs }
export const DeflectometryType: Story = { args: { ...baseArgs, projectType: 'deflectometry' } }
export const ReadOnly: Story = { args: { ...baseArgs, canEdit: false } }
export const NotOwner: Story = { args: { ...baseArgs, isOwner: false } }

export const GroupingEnabled: Story = {
  args: { ...baseArgs, groupEnabled: true, groupRegex: '^([^_]+_[^_]+)_', groupRepRegex: '_x_orig\\.png$' },
}

export const OwnerVisibilityRestricted: Story = {
  args: { ...baseArgs, groupVisible: 'owner' as GroupVisible },
}
export const OwnerAndManager: Story = {
  args: { ...baseArgs, groupVisible: 'owner_and_manager' as GroupVisible },
}

export const SavingState: Story = { args: { ...baseArgs, saveState: 'saving' } }
export const SavedState: Story = { args: { ...baseArgs, saveState: 'saved' } }
export const ErrorState: Story = { args: { ...baseArgs, saveState: 'error', saveErrorMessage: 'Server returned 500.' } }
export const NameInvalid: Story = { args: { ...baseArgs, name: '', nameInvalid: true } }

export const Interactive: Story = {
  render: () => {
    const [name, setName] = useState('Wafer line A')
    const [desc, setDesc] = useState('Production line A defect labeling.')
    const [groupEnabled, setGroupEnabled] = useState(false)
    const [groupRegex, setGroupRegex] = useState('')
    const [groupRepRegex, setGroupRepRegex] = useState('')
    const [allowDup, setAllowDup] = useState(false)
    const [showFilename, setShowFilename] = useState(true)
    const [showBbox, setShowBbox] = useState(true)
    const [visible, setVisible] = useState<GroupVisible>('all')
    return (
      <ProjectSettingsForm
        projectType="general"
        canEdit
        isOwner
        saveState="idle"
        nameInvalid={!name.trim()}
        name={name} onChangeName={setName}
        description={desc} onChangeDescription={setDesc}
        groupEnabled={groupEnabled} onChangeGroupEnabled={setGroupEnabled}
        groupRegex={groupRegex} onChangeGroupRegex={setGroupRegex}
        groupRepRegex={groupRepRegex} onChangeGroupRepRegex={setGroupRepRegex}
        allowDup={allowDup} onChangeAllowDup={setAllowDup}
        showFilenameInGallery={showFilename} onChangeShowFilenameInGallery={setShowFilename}
        showBboxClassNamesInDetail={showBbox} onChangeShowBboxClassNamesInDetail={setShowBbox}
        groupVisible={visible} onChangeGroupVisible={setVisible}
      />
    )
  },
}
