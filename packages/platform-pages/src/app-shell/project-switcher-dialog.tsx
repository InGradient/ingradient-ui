import styled from 'styled-components'
import { Button, DialogShell, SelectableListItem } from '@ingradient/ui/components'
import { Stack } from '@ingradient/ui/primitives'
import { DialogHint, DialogScrollBody, RowMeta } from './app-shell-dialogs.styles'

const DIALOG_WIDTH = 'min(var(--ig-popup-xl), 100%)'
const FULL_WIDTH_STYLE = { width: '100%' }

const ProjectLabel = styled.span`
  display: flex;
  flex-direction: column;
  gap: var(--ig-spacing-2);
  width: 100%;
  min-width: 0;
`

const ProjectDescription = styled(RowMeta).attrs({ as: 'span' })`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export interface ProjectSwitcherDialogProject {
  id: string
  name: string
  description?: string
}

export interface ProjectSwitcherDialogProps {
  open: boolean
  projects: ProjectSwitcherDialogProject[]
  currentId?: string | null
  /** The app needs a project before it can continue: the dialog cannot be dismissed while the list is empty. */
  requireSelection?: boolean
  onClose: () => void
  onSelect: (id: string) => void
  onCreate: () => void
}

/** Project list opened from the app shell's project switcher row. */
export function ProjectSwitcherDialog({
  open, projects, currentId, requireSelection = false, onClose, onSelect, onCreate,
}: ProjectSwitcherDialogProps) {
  if (!open) return null
  const empty = projects.length === 0
  const canClose = !requireSelection || !empty
  return (
    <DialogShell title="Projects" onClose={canClose ? onClose : undefined} width={DIALOG_WIDTH}>
      <Stack gap="var(--ig-spacing-16)" data-ig-component="ProjectSwitcherDialog">
        <DialogScrollBody>
          {empty ? (
            <DialogHint>No projects yet. Create your first project to continue.</DialogHint>
          ) : (
            <Stack gap="var(--ig-spacing-4)">
              {projects.map((project) => (
                <SelectableListItem
                  key={project.id}
                  variant="flat"
                  selected={project.id === currentId}
                  aria-current={project.id === currentId ? 'true' : undefined}
                  onClick={() => onSelect(project.id)}
                >
                  <ProjectLabel>
                    <span>{project.name}</span>
                    {project.description ? (
                      <ProjectDescription title={project.description}>{project.description}</ProjectDescription>
                    ) : null}
                  </ProjectLabel>
                </SelectableListItem>
              ))}
            </Stack>
          )}
        </DialogScrollBody>
        <Button type="button" variant="secondary" style={FULL_WIDTH_STYLE} onClick={onCreate}>
          {empty ? 'Create Project' : '+ Add Project'}
        </Button>
      </Stack>
    </DialogShell>
  )
}
