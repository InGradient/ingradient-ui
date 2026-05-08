/**
 * @deprecated --portal-* 레거시 CSS 변수 매핑.
 *
 * 2026-05-08 기준 ingradient-platform, ingradient-edge, @ingradient/ui 자체
 * 어디서도 var(--portal-*) 를 사용하지 않음 (D-5 마이그레이션 완료).
 *
 * 이 매핑은 더 이상 renderTokensCss() 출력에 포함되지 않으며, 외부 코드가
 * 이 export를 import해서 직접 emit하지 않는 한 런타임에 적용되지 않음.
 *
 * 다음 메이저 버전에서 파일 자체 삭제 예정. 새 코드는 var(--ig-color-*) 사용.
 */
export const legacyPortalCssVariables = {
  '--portal-bg-base': 'var(--ig-color-bg-canvas)',
  '--portal-bg-radial-a': 'var(--ig-color-bg-radial-a)',
  '--portal-bg-radial-b': 'var(--ig-color-bg-radial-b)',
  '--portal-surface-header': 'var(--ig-color-surface-header)',
  '--portal-surface-panel': 'var(--ig-color-surface-panel)',
  '--portal-surface-elevated': 'var(--ig-color-surface-raised)',
  '--portal-surface-muted': 'var(--ig-color-surface-muted)',
  '--portal-surface-interactive': 'var(--ig-color-surface-interactive)',
  '--portal-surface-active': 'var(--ig-color-surface-active)',
  '--portal-border': 'var(--ig-color-border-subtle)',
  '--portal-border-strong': 'var(--ig-color-border-strong)',
  '--portal-text-primary': 'var(--ig-color-text-primary)',
  '--portal-text-secondary': 'var(--ig-color-text-secondary)',
  '--portal-text-muted': 'var(--ig-color-text-muted)',
  '--portal-text-soft': 'var(--ig-color-text-soft)',
  '--portal-accent': 'var(--ig-color-accent)',
  '--portal-accent-strong': 'var(--ig-color-accent-strong)',
  '--portal-accent-soft': 'var(--ig-color-accent-soft)',
  '--portal-success': 'var(--ig-color-success)',
  '--portal-warning': 'var(--ig-color-warning)',
  '--portal-danger': 'var(--ig-color-danger)',
  '--portal-shadow': 'var(--ig-shadow-panel)',
  '--portal-scrollbar-thumb': 'var(--ig-scrollbar-thumb)',
  '--portal-scrollbar-thumb-hover': 'var(--ig-scrollbar-thumb-hover)',
  '--portal-scrollbar-thumb-active': 'var(--ig-scrollbar-thumb-active)',
} as const
