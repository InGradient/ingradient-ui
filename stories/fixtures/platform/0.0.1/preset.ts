/**
 * platform 0.0.1 preset — src/tokens/presets/platform/0.0.1 의 실제 Preset 을 re-export.
 *
 * fixtures 레벨에서 한 번 더 노출하는 이유: story 파일이 fixtures/ 만 import 하면 충분
 * 하도록. preset 메타데이터 변경 시 src/ 만 수정하면 fixture 도 자동 반영.
 */
export { platformV001 as platformV001Preset } from '@ingradient/ui/tokens'
