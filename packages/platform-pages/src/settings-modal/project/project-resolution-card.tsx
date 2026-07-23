import { Box, Inline, Stack, Text } from '@ingradient/ui/primitives'
import { Card, SelectField } from '@ingradient/ui/components'

const SELECT_STYLE = { minWidth: 'var(--ig-popup-xs-narrow)' }

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
    <Card elevation="raised" flat border="strong" radius="var(--ig-radius-xs)" padding="var(--ig-space-6)">
      <Stack gap="var(--ig-space-4)">
      <Box>
        <Text as="div" size="var(--ig-font-size-md)" weight={600}>{project.project_name}</Text>
        <Text as="div" tone="muted" size="var(--ig-font-size-xs)">
          role: {project.role} · members: {project.member_count}
          {project.owner_count !== undefined ? ` · owners: ${project.owner_count}` : ''}
        </Text>
      </Box>
      <Inline gap="var(--ig-space-4)" wrap="wrap">
        <SelectField
          value={resolution.action}
          onChange={(e) => onChange({ ...resolution, action: (e.target as HTMLSelectElement).value as ProjectResolution['action'] })}
          aria-label={`Resolution for ${project.project_name}`}
          style={SELECT_STYLE}
        >
          <option value="transfer">Transfer ownership</option>
          <option value="delete_project">Delete project</option>
        </SelectField>
        {resolution.action === 'transfer' ? (
          <SelectField
            value={resolution.transfer_user_id ?? ''}
            onChange={(e) => onChange({ action: 'transfer', transfer_user_id: (e.target as HTMLSelectElement).value || undefined })}
            aria-label={`Transfer target for ${project.project_name}`}
            style={SELECT_STYLE}
          >
            <option value="">Select user</option>
            {project.transfer_candidates.map((c) => (
              <option key={c.user_id} value={c.user_id}>
                {c.name || c.email} ({c.email})
              </option>
            ))}
          </SelectField>
        ) : null}
      </Inline>
      </Stack>
    </Card>
  )
}
