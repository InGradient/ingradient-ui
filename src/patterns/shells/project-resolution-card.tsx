import styled from 'styled-components'
import { SelectField } from '../../components/inputs/select-field'

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
  padding: var(--ig-space-6);
  border: 1px solid var(--ig-color-border-strong);
  border-radius: var(--ig-radius-xs);
  background: var(--ig-color-surface-raised);
`

const Title = styled.div`
  color: var(--ig-color-text-primary);
  font-size: 14px;
  font-weight: 600;
`

const Meta = styled.div`
  color: var(--ig-color-text-muted);
  font-size: 12px;
`

const FieldRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--ig-space-4);
`

const StyledSelect = styled(SelectField)`
  min-width: 180px;
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
    <Card>
      <div>
        <Title>{project.project_name}</Title>
        <Meta>
          role: {project.role} · members: {project.member_count}
          {project.owner_count !== undefined ? ` · owners: ${project.owner_count}` : ''}
        </Meta>
      </div>
      <FieldRow>
        <StyledSelect
          value={resolution.action}
          onChange={(e) => onChange({ ...resolution, action: (e.target as HTMLSelectElement).value as ProjectResolution['action'] })}
          aria-label={`Resolution for ${project.project_name}`}
        >
          <option value="transfer">Transfer ownership</option>
          <option value="delete_project">Delete project</option>
        </StyledSelect>
        {resolution.action === 'transfer' ? (
          <StyledSelect
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
          </StyledSelect>
        ) : null}
      </FieldRow>
    </Card>
  )
}
