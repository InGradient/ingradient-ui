import { expect, userEvent, waitFor, within } from 'storybook/test'
import type { SettingsModalStoryArgs } from './settings-modal-story-runtime'

type Canvas = ReturnType<typeof within>
type Step = (label: string, run: () => Promise<void> | void) => Promise<void> | void
type PlayContext = {
  args: SettingsModalStoryArgs
  canvas: Canvas
  canvasElement: HTMLElement
  step: Step
}

async function clickCheckbox(input: HTMLElement) {
  const label = input.closest('label')
  if (!label) throw new Error('Expected Checkbox input to be wrapped by a label')
  await userEvent.click(label)
}

export async function playGeneralPreferences({ args, canvas, step }: PlayContext) {
  const body = within(document.body)

  await step('Navigate away and return to General settings', async () => {
    await userEvent.click(canvas.getByRole('tab', { name: 'Account' }))
    await expect(args.onTabChange).toHaveBeenLastCalledWith('account')
    await userEvent.click(canvas.getByRole('tab', { name: 'General' }))
    await expect(args.onTabChange).toHaveBeenLastCalledWith('general')
  })

  await step('Change the interface language', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'English' }))
    await userEvent.click(await body.findByRole('option', { name: 'Korean' }))
    await expect(args.onGeneralPreferenceChange).toHaveBeenLastCalledWith('locale', 'ko')
    await expect(canvas.getByRole('button', { name: 'Korean' })).toBeVisible()
  })

  await step('Update workspace preferences', async () => {
    const hover = canvas.getByRole('checkbox', { name: 'Enable hover preview in data grids' })
    const singleClick = canvas.getByRole('checkbox', { name: 'Use single click to open edit flow' })
    await clickCheckbox(hover)
    await expect(args.onGeneralPreferenceChange).toHaveBeenCalledWith(
      'enableHoverPreview',
      false,
    )
    await clickCheckbox(singleClick)
    await expect(args.onGeneralPreferenceChange).toHaveBeenLastCalledWith(
      'singleClickToEdit',
      true,
    )
    await expect(hover).not.toBeChecked()
    await expect(singleClick).toBeChecked()
  })
}

export async function playPasswordChange({ args, canvas, step }: PlayContext) {
  const body = within(document.body)

  await step('Open the password dialog and show mismatch validation', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'Change password' }))
    await expect(args.onDialogAction).toHaveBeenLastCalledWith('change-password', 'open')
    const dialog = await body.findByRole('dialog', { name: 'Change Password' })
    await userEvent.type(within(dialog).getByLabelText('Current password'), 'old-password')
    await userEvent.type(within(dialog).getByLabelText('New password'), 'new-password')
    await userEvent.type(within(dialog).getByLabelText('Confirm new password'), 'different')
    await expect(
      within(dialog).getByText('New password and confirmation must match.'),
    ).toBeVisible()
    await expect(within(dialog).getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  await step('Correct the confirmation and submit', async () => {
    const dialog = body.getByRole('dialog', { name: 'Change Password' })
    const confirmation = within(dialog).getByLabelText('Confirm new password')
    await userEvent.clear(confirmation)
    await userEvent.type(confirmation, 'new-password')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Save' }))
    await expect(args.onAccountAction).toHaveBeenCalledWith('submit-password')
    await expect(args.onDialogAction).toHaveBeenLastCalledWith('change-password', 'submit')
    await waitFor(() => {
      expect(body.queryByRole('dialog', { name: 'Change Password' })).not.toBeInTheDocument()
    })
  })
}

export async function playProjectConfiguration({ args, canvas, step }: PlayContext) {
  await step('Enable image grouping', async () => {
    const grouping = canvas.getByRole('checkbox', {
      name: 'Group multiple images as one item (for labeling)',
    })
    await clickCheckbox(grouping)
    await expect(args.onProjectAction).toHaveBeenLastCalledWith('change-groupEnabled', true)
    await expect(grouping).toBeChecked()
  })

  await step('Configure the grouping expressions', async () => {
    const groupPattern = canvas.getByLabelText(
      'Group key pattern (regex with one capture group)',
    )
    const representative = canvas.getByLabelText(
      'Representative image pattern (optional regex)',
    )
    await userEvent.type(groupPattern, '^(sample)_')
    await userEvent.type(representative, '_x_orig\\.png$')
    await expect(args.onProjectAction).toHaveBeenLastCalledWith(
      'change-groupRepRegex',
      '_x_orig\\.png$',
    )
    await expect(groupPattern).toHaveValue('^(sample)_')
  })
}

export async function playProjectPermissions({ args, canvas, step }: PlayContext) {
  await step('Change a manager permission', async () => {
    const permission = canvas.getByRole('checkbox', { name: 'Manager Delete' })
    await expect(permission).toBeChecked()
    await clickCheckbox(permission)
    await expect(args.onProjectAction).toHaveBeenCalledWith(
      'permission:manager:label.delete',
      false,
    )
  })

  await step('Collapse the detailed permission matrix', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse All' }))
    await expect(args.onProjectAction).toHaveBeenLastCalledWith('toggle-permissions', false)
    await expect(canvas.getByRole('button', { name: 'Expand All' })).toBeVisible()
  })
}

export async function playEdgeExportSelection({ args, canvas, step }: PlayContext) {
  await step('Extend the export selection', async () => {
    await clickCheckbox(canvas.getByRole('checkbox', { name: 'Wafer line B' }))
    await expect(args.onEdgeAction).toHaveBeenCalledWith('toggle-dataset', 'ds-2')
    await clickCheckbox(canvas.getByRole('checkbox', { name: 'Soyeon Park' }))
    await expect(args.onEdgeAction).toHaveBeenCalledWith('toggle-user', 'u-2')
  })

  await step('Request a project package', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'Create Project File (.ige)' }))
    await expect(args.onEdgeAction).toHaveBeenLastCalledWith('create-package')
  })
}

export async function playMembersAndInvitations({ args, canvas, step }: PlayContext) {
  await step('Search for a registered user', async () => {
    const search = canvas.getByRole('textbox', { name: 'Search users' })
    await userEvent.type(search, 'sangha')
    await expect(args.onOrganizationAction).toHaveBeenLastCalledWith(
      'search-invitations',
      'sangha',
    )
    await expect(canvas.getByText('Sangha Lee')).toBeVisible()
  })

  await step('Invite the matching user', async () => {
    await userEvent.click(canvas.getByRole('button', { name: /Sangha Lee.*Invite/ }))
    await expect(args.onOrganizationAction).toHaveBeenLastCalledWith(
      'invite-user',
      'u-sangha',
    )
  })
}

export async function playDeviceManagement({ args, canvas, step }: PlayContext) {
  await step('Filter devices by UID', async () => {
    const search = canvas.getByPlaceholderText('Search UID or name…')
    await userEvent.type(search, 'GHI')
    await expect(args.onDeviceAction).toHaveBeenLastCalledWith('search', 'GHI')
    await expect(canvas.getByText('Edge-B2')).toBeVisible()
    await expect(canvas.queryByText('Edge-A1')).not.toBeInTheDocument()
  })

  await step('Open and submit the registration form', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'Register Device' }))
    await expect(args.onDeviceAction).toHaveBeenCalledWith('toggle-register', true)
    const uid = canvas.getByPlaceholderText('Device UID')
    await userEvent.type(uid, 'STORY-DEVICE-001')
    await userEvent.click(canvas.getByRole('button', { name: 'Register', exact: true }))
    await expect(args.onDeviceAction).toHaveBeenCalledWith('register', 'STORY-DEVICE-001')
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel', exact: true }))
    await expect(args.onDeviceAction).toHaveBeenLastCalledWith('cancel-register')
  })
}

export async function playStorageReport({ args, canvas, step }: PlayContext) {
  await step('Request a storage report copy', async () => {
    await userEvent.click(canvas.getByRole('button', { name: 'Copy Report' }))
    await expect(args.onStorageAction).toHaveBeenLastCalledWith('copy-report')
  })
}
