/**
 * Backward-compat alias. recipes 는 primitives/ 로 이동했지만
 * `@ingradient/ui/tokens` 에서 re-export 유지 (1~2 minor 후 제거 검토).
 *
 * 새 코드는 `@ingradient/ui/primitives` 에서 직접 import 권장.
 */
export * from '../primitives/recipes'
