import styled from 'styled-components'
import { Box, Inline, Stack, Text } from '@ingradient/ui/primitives'
import { Card, SelectField } from '@ingradient/ui/components'

const SelectBox = styled(SelectField)`
  min-width: var(--ig-popup-xs-narrow);
`

export interface ProjectResolutionCandidate {
  user_id: string
  name?: string | null
  email: string
}

export interface ProjectResolutionInfo {
  project_id: string
  project_name: string
  role: string
  member_count: number
  owner_count?: number
  transfer_candidates: ProjectResolutionCandidate[]
}

export interface ProjectResolution {
  action: 'transfer' | 'delete_project'
  transfer_user_id?: string
}

export interface ProjectResolutionCardProps {
  project: ProjectResolutionInfo
  resolution: ProjectResolution
  onChange: (next: ProjectResolution) => void
}

export function ProjectResolutionCard({ project, resolution, onChange }: ProjectResolutionCardProps) {
  return (
    <Card elevation="raised" flat border="strong" radius="var(--ig-radius-xs)" padding="var(--ig-spacing-12)">
      <Stack gap="var(--ig-spacing-8)">
      <Box>
        <Text as="div" size="var(--ig-text-body)" weight="semibold">{project.project_name}</Text>
        <Text as="div" tone="muted" size="var(--ig-text-caption)">
          role: {project.role} · members: {project.member_count}
          {project.owner_count !== undefined ? ` · owners: ${project.owner_count}` : ''}
        </Text>
      </Box>
      <Inline gap="var(--ig-spacing-8)" wrap="wrap">
        <SelectBox
          value={resolution.action}
          onChange={(e) => onChange({ ...resolution, action: (e.target as HTMLSelectElement).value as ProjectResolution['action'] })}
          aria-label={`Resolution for ${project.project_name}`}
        >
          <option value="transfer">Transfer ownership</option>
          <option value="delete_project">Delete project</option>
        </SelectBox>
        {resolution.action === 'transfer' ? (
          <SelectBox
            value={resolution.transfer_user_id ?? ''}
            onChange={(e) => onChange({ action: 'transfer', transfer_user_id: (e.target as HTMLSelectElement).value || undefined })}
            aria-label={`Transfer target for ${project.project_name}`}
          >
            <option value="">Select user</option>
            {project.transfer_candidates.map((c) => (
              <option key={c.user_id} value={c.user_id}>
                {c.name || c.email} ({c.email})
              </option>
            ))}
          </SelectBox>
        ) : null}
      </Inline>
      </Stack>
    </Card>
  )
}
