import styled from 'styled-components'

const Hint = styled.p`
  margin: 0;
  color: var(--ig-color-text-muted);
  font-size: 13px;
  line-height: 1.5;
`

const Expired = styled.p`
  margin: 0;
  color: var(--ig-color-danger);
  font-size: 13px;
  font-weight: 600;
`

export interface LicenseInfo {
  type: 'organization' | 'personal'
  organizationName?: string | null
  expiresAt: string | null
  remainingDays: number | null
  expired: boolean
}

export interface LicenseInfoDisplayProps {
  license: LicenseInfo | null
  loadingText?: string
  expiredText?: string
  organizationTemplate?: (license: LicenseInfo) => string
  personalTemplate?: (license: LicenseInfo) => string
}

const DEFAULT_ORG = (l: LicenseInfo) =>
  `조직 라이선스 (${l.organizationName ?? ''}) | 만료: ${l.expiresAt ?? '—'} (${l.remainingDays ?? 0}일)`
const DEFAULT_PERSONAL = (l: LicenseInfo) =>
  `개인 라이선스 | 만료: ${l.expiresAt ?? '—'} (${l.remainingDays ?? 0}일)`

export function LicenseInfoDisplay({
  license,
  loadingText = '라이선스 정보를 불러오는 중…',
  expiredText = '만료됨',
  organizationTemplate = DEFAULT_ORG,
  personalTemplate = DEFAULT_PERSONAL,
}: LicenseInfoDisplayProps) {
  if (!license) return <Hint>{loadingText}</Hint>
  if (license.expired) return <Expired>{expiredText}</Expired>
  if (license.type === 'organization') return <Hint>{organizationTemplate(license)}</Hint>
  return <Hint>{personalTemplate(license)}</Hint>
}
