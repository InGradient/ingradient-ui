import { Text } from '../../primitives'

const HINT_STYLE = { margin: 0, lineHeight: 1.5 }
const EXPIRED_STYLE = { margin: 0 }

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
  if (!license) return <Text as="p" tone="muted" size="13px" style={HINT_STYLE}>{loadingText}</Text>
  if (license.expired) return <Text as="p" tone="danger" size="13px" weight={600} style={EXPIRED_STYLE}>{expiredText}</Text>
  if (license.type === 'organization') return <Text as="p" tone="muted" size="13px" style={HINT_STYLE}>{organizationTemplate(license)}</Text>
  return <Text as="p" tone="muted" size="13px" style={HINT_STYLE}>{personalTemplate(license)}</Text>
}
